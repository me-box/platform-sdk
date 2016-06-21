import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';
import { connect } from 'react-redux';
import D3Node from './svg/D3Node';
import Link from './svg/Link';
import { createSelector } from 'reselect'

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
    	top: 35,
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

const getTab = (state) => state.tabs.current;
const getNodes = (state) => state.nodes.nodes;
const getLinks = (state) => state.ports.links;

const getVisibleNodes = createSelector(
	[getTab, getNodes],
	(tab, nodes)=>{
		return nodes.filter((node)=>{
    		return tab ? tab.id === node.z : false
    	});
	}
);

const getVisibleLinks= createSelector(
	[getTab, getLinks],
	(tab,links)=>{
		return links.filter((link)=>{
    		return tab ? tab.id === link.source.z : false
    	});
    }
);

function mapStateToProps(state) {
  return {
    nodes: getVisibleNodes(state), 
    selected: state.nodes.selected,
    links: getVisibleLinks(state)
  };
}

export default connect(mapStateToProps)(DragLayer(collect)(Chart))