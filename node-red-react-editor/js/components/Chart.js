import React, {Component, PropTypes} from 'react';
import {DragLayer} from 'react-dnd';

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
    const { item, itemType, currentOffset, isDragging } = this.props;
    
    
    let chartstyle = {
    	left:180,
    	width:'100%',
    }

    return <div id="chart" style={chartstyle}></div>
    
  }
}

export default DragLayer(collect)(Chart)