import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class DragDropContainer extends Component {
  
  render(){
  	let style = {width:1000, height:1000, background:'green'}
    return <div >
 				{this.props.children}
    		</div>
  }
}

export default DragDropContext(HTML5Backend)(DragDropContainer);