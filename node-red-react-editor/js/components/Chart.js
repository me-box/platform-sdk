import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';
import { connect } from 'react-redux';
import D3Node from './svg/D3Node';
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

  _onMouseMove(e){
  	const {clientX, clientY} = e;
  	this.mouseMove(clientX,clientY);
  }

  render() {
    const { nodes, item, itemType, currentOffset, isDragging, dispatch } = this.props;
    
    let chartstyle = {
    	left:180,
    	width:'100%',
    }

    let d3nodes = nodes.map((node)=>{
    	const d3nodeprops = {
    		key: node.id,
    		d: node,
    		...bindActionCreators(NodeMouseActions, dispatch),
    	}
    	return <D3Node {...d3nodeprops}/>
    })

    let chartprops = {
    	onMouseMove: this._onMouseMove,
    	onMouseUp: this.mouseUp,
    }

    return <div id="chart"  style={chartstyle}>
    			<div mousecontainer {...chartprops} width="1000" height="800">
    			<svg id="svgchart" width='1000' height='800'>
    				{d3nodes}
    			</svg>
    			</div>
    	   </div>
    
  }
}

function select(state) {
  return {
    nodes: state.nodes.activeNodes
  };
}

export default connect(select)(DragLayer(collect)(Chart))