import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class DragDropContainer extends Component {
  
  render(){
  	let style = {width:'100%', height:'100%'}
    return <div style={style}>
 				{this.props.children}
    		</div>
  }
}

export default DragDropContext(HTML5Backend)(DragDropContainer);