import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';
import { connect } from 'react-redux';
import Node from '../svg/Node';
import Link from '../svg/Link';
import { createSelector } from 'reselect'
import { actionCreators as nodeActions } from '../../actions';
import { actionCreators as mouseActions } from 'features/mouse';
import { DropTarget } from 'react-dnd';
//import * as NodeMouseActions from '../actions/NodeMouseActions';
//import * as MouseActions from '../actions/MouseActions';


import { bindActionCreators } from 'redux';

function collect(connect, monitor) { 
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
   
}

const canvasTarget = {
  drop(props,monitor) {
    const item = monitor.getItem();
    const {x,y}   = monitor.getSourceClientOffset()
    item.handleDrop(x,y);
  }
};

const ItemTypes = {
  NODE: 'node'
};


class NodeCanvas extends Component {

  constructor(props){
  	super(props);
  	this._onMouseMove = this._onMouseMove.bind(this);
  	this._onScroll = this._onScroll.bind(this);
  
  	this.mouseMove = bindActionCreators(mouseActions.mouseMove, this.props.dispatch);
  	this.mouseUp   = bindActionCreators(mouseActions.mouseUp, this.props.dispatch);
  	
    /*this.scroll = bindActionCreators(MouseActions.scroll, this.props.dispatch);
  	this.linkSelected = bindActionCreators(linkSelected, this.props.dispatch);*/
  }

  render() {

    const {nodes, links, connectDropTarget, w, h} = this.props;
   
    const _nodes = nodes.map((id)=>{
      return  <Node key={id} id={id}/>
    })

    const _links = links.map((id)=>{
      return <Link key={id} id={id}/>
    })
    
    const chartstyle = {
      top: 35,
      width: w,
      height: h,
    }

    return  connectDropTarget(<div id="chart" onMouseMove={this._onMouseMove} onMouseUp={this.mouseUp} style={chartstyle}>
               <svg id="svgchart" width={w} height={h}>
                  {_links}
                  {_nodes}
               </svg>
            </div> ); 
  }


    /*const { w,h,nodes, selectedNode, selectedLink, links, item, itemType, currentOffset, isDragging, dispatch } = this.props;
    
    let chartstyle = {
    	top: 35,
    	width:'100%',
    }

    let d3nodes = nodes.map((node)=>{
    	const d3nodeprops = {
    		key: node.id,
        	selected: selectedNode ? selectedNode.id == node.id : false,
    		d: node,
    		...bindActionCreators(NodeMouseActions, dispatch),
    	}
    	return <D3Node {...d3nodeprops}/>
    })

    let connectors = links.map((link, i)=>{
    	let selected = false;
    	
    	if (this.props.selectedLink){
    		if (this.props.selectedLink.source.id === link.source.id && this.props.selectedLink.target.id === link.target.id){
    			selected = true;
    		}
    	}
    	const linkprops = {
    		key: `${i}${link.source.id}${link.target.id}`,
    		source: link.source,
    		target: link.target,
    		onClick: this.linkSelected.bind(this, link),
    		selected: selected,
    		sourcePort: link.sourcePort,
    	}
    	return <Link{...linkprops} />
    })

    const chartprops = {
    	onMouseMove: this._onMouseMove,
    	onMouseUp: this.mouseUp,
    }

	
    
    return <div id="chart"  style={chartstyle} onScroll={this._onScroll}>
   				
    			<div {...chartprops} width={w} height={h}>
    			<svg id="svgchart" width={w} height={h}>
    				{connectors}
    				{d3nodes}
    			</svg>
    			</div>
    	   </div>
    
  }*/
  
  _onScroll(e){
  	this.scroll(e.target.scrollTop);
  }
  
  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX,clientY);
  }

}

const getTab = (state) => state.workspace.current;
//const getNodes = (state) => state.nodes.nodesById;
const getLinks = (state) => state.ports.links;

/*const getVisibleNodes = createSelector(
	[getTab, getNodes],
	(tab, nodes)=>{
		return Object.keys(nodes).reduce((acc,key)=>{
        const node = nodes[key]; 
    		return tab ? tab.id === node.z : false
    	},[]);
	}
);*/

const getVisibleLinks= createSelector(
	[getTab, getLinks],
	(tab,links)=>{
		return links.filter((link)=>{
    		return tab ? tab.id === link.source.z : false
    	});
    }
);

function select(state) {
  const tabId = state.workspace.currentId;
  //TODO: - hacky - this needs to be in secltors of corresponding reducers
  return {
    nodes: Object.keys(state.nodes.nodesById).reduce((acc, key)=>{
       const n = state.nodes.nodesById[key];
       if (n.z === tabId){
          acc.push(n.id);
       }
       return acc;
    },[]),
    links: Object.keys(state.ports.linksById).reduce((acc, key)=>{
       const l = state.ports.linksById[key];
       if (l.source.z === tabId){
          acc.push(l.id);
       }
       return acc;
    },[]),
    w: state.editor.screen.w,
    h: state.editor.screen.h, 
  };
}

export default connect(select)(DropTarget(ItemTypes.NODE, canvasTarget, collect)(NodeCanvas));
//export default connect(mapStateToProps)(DragLayer(collect)(NodeCanvas))