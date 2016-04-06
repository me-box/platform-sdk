import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';
import { connect } from 'react-redux';
import D3Node from './svg/D3Node';

function collect(monitor) { 
  
  return { 
  		item: monitor.getItem(),
    	itemType: monitor.getItemType(),
    	currentOffset: monitor.getSourceClientOffset(),
    	isDragging: monitor.isDragging()
   };
}


class Chart extends Component {

  render() {
    const { nodes, item, itemType, currentOffset, isDragging } = this.props;
    
   
    let chartstyle = {
    	left:180,
    	width:'100%',
    }

    let d3nodes = nodes.map((node)=>{
    	return <D3Node {...node}/>
    })

    return <div id="chart" style={chartstyle}>
    			<svg id="svgchart" width='1000' height='800'>
    				{d3nodes}
    			</svg>
    	   </div>
    
  }
}

function select(state) {
  return {
    nodes: state.nodes.activeNodes
  };
}

export default connect(select)(DragLayer(collect)(Chart))