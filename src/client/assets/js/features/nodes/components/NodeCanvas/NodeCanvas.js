import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import Node from '../svg/Node';
import Link from '../svg/Link';
import Badge from '../svg/Badge';
import { actionCreators as mouseActions } from 'features/mouse';
import { DropTarget } from 'react-dnd';
import { selector } from '../..';

import { bindActionCreators } from 'redux';

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };

}

const canvasTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    const { x, y } = monitor.getSourceClientOffset()
    item.handleDrop(x, y);
  }
};

const ItemTypes = {
  NODE: 'node'
};


class NodeCanvas extends Component {

  static contextTypes = {
    store: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { mousePressed: false };
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this.mouseMove = bindActionCreators(mouseActions.mouseMove, this.props.dispatch);
    this.mouseDown = bindActionCreators(mouseActions.mouseDown, this.props.dispatch);
    this.mouseUp = bindActionCreators(mouseActions.mouseUp, this.props.dispatch);
  }

  render() {


    const { nodes, configs, links, connectDropTarget, w, h } = this.props;
    const { store } = this.context;


    const _nodes = nodes.map((id) => {
      return <Node key={id} id={id} />
    })

    const _configs = configs.map((config, i) => {
      const elementprops = {
        store,
        id: config.id,
      }


      return <div key={i}>
        {React.createElement(config.fn, { ...elementprops })}
      </div>
    })
    const _links = links.map((id) => {
      return <Link key={id} id={id} />
    })

    const _badges = links.map((id) => {
      return <Badge key={id} id={id} />
    })

    const chartstyle = {
      overflow: "hidden",
      width: w,
      height: h,
    }

    return connectDropTarget(<div id="chart" onMouseMove={this._onMouseMove} onMouseUp={this._onMouseUp} onMouseDown={this._onMouseDown} style={chartstyle}>
      <svg id="svgchart" width={w} height={h}>
        {_links}
        {_nodes}
        {_badges}
      </svg>
      {_configs}
    </div>);
  }

  _onScroll(e) {
    this.scroll(e.target.scrollTop);
  }

  _onMouseMove(e) {
    const { clientX, clientY } = e;

    //console.log(this.props);

    if (this.props.draggingNode != null || this.props.portSelected != null) {
      this.mouseMove(clientX, clientY);
    }
  }

  _onMouseDown(e) {
    this.setState({ mousePressed: true });
    this.mouseDown(e);
  }

  _onMouseUp(e) {

    this.setState({ mousePressed: false });
    this.mouseUp(e);
  }
}
export default connect(selector)(DropTarget(ItemTypes.NODE, canvasTarget, collect)(NodeCanvas));
