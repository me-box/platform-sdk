import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class DragDropContainer extends Component {
  
  render(){
  	const {w,h} = this.props;
  	
  	let style = {width:w, height:h}
    return <div style={style}>
 				{this.props.children}
    		</div>
  }
}

export default DragDropContext(HTML5Backend)(DragDropContainer);