import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';
import { connect } from 'react-redux';
import D3Node from './svg/D3Node';
import Link from './svg/Link';

import * as NodeMouseActions from '../actions/NodeMouseActions';
import * as MouseActions from '../actions/MouseActions';
import { bindActionCreators } from 'redux';

function collect(monitor) { 
  
  return { 
  		item: monitor.getItem(),
    	itemType: monitor.getItemType(),
    	currentOffset: monitor.getSourceClientOffset(),
    	isDragging: monitor.isDragging()
   };
}



class Chart extends Component {

  constructor(props){
  	super(props);
  	this._onMouseMove = this._onMouseMove.bind(this);
  	this.mouseMove = bindActionCreators(MouseActions.mouseMove, this.props.dispatch);
  	this.mouseUp = bindActionCreators(MouseActions.mouseUp, this.props.dispatch);
  }

  render() {
    const { w,h,nodes, selected, links, item, itemType, currentOffset, isDragging, dispatch } = this.props;
    
    let chartstyle = {
    	left:180,
    	width:'100%',
    }

    let d3nodes = nodes.map((node)=>{
    	const d3nodeprops = {
    		key: node.id,
        selected: selected ? selected.id == node.id : false,
    		d: node,
    		...bindActionCreators(NodeMouseActions, dispatch),
    	}
    	return <D3Node {...d3nodeprops}/>
    })

    let connectors = links.map((link, i)=>{
    	const linkprops = {
    		key: `${i}${link.source.id}${link.target.id}`,
    		source: link.source,
    		target: link.target,
    	}
    	return <Link {...linkprops} />
    })

    let chartprops = {
    	onMouseMove: this._onMouseMove,
    	onMouseUp: this.mouseUp,
    }

    return <div id="chart"  style={chartstyle}>
    			<div mousecontainer {...chartprops} width={w} height={h}>
    			<svg id="svgchart" width={w} height={h}>
    				{d3nodes}
    				{connectors}
    			</svg>
    			</div>
    	   </div>
    
  }

  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX,clientY);
  }

}


function select(state) {
  return {
    nodes: state.nodes.nodes,
    selected: state.nodes.selected,
    links: state.ports.links,
  };
}

export default connect(select)(DragLayer(collect)(Chart))