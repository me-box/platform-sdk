import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector, NAME } from '../../';
import './Canvas.scss';
import {Circle,Ellipse,Text,Rect,Line,Path,Group} from '../svg/';
import { DropTarget } from 'react-dnd';

//import {PALETTE_WIDTH} from 'features/palette/constants';
const PALLETE_WIDTH = 150;

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const canvasTarget = {
  drop(props,monitor) {
    const {template,children} = monitor.getItem();

    const {x,y}   = monitor.getSourceClientOffset()
    if (template !== "group"){
      props.dispatch(canvasActions.templateDropped(template,(x-100),y))
    }else{
      props.dispatch(canvasActions.groupTemplateDropped(children, (x-100), y))
    }
  }
};

const ItemTypes = {
  TEMPLATE: 'template'
};

class EditorCanvas extends Component {

  constructor(props, context){
  	super(props, context);
  	this._onMouseMove = this._onMouseMove.bind(this);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove, props.dispatch);
    this.onMouseUp = bindActionCreators(canvasActions.onMouseUp, props.dispatch);
    this.deletePressed = bindActionCreators(canvasActions.deletePressed, props.dispatch);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    window.addEventListener('keydown', this._handleKeyDown);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    //console.log(`${clientX},${clientY}`);
    this.mouseMove(clientX-PALETTE_WIDTH,clientY);
  }

  renderTemplate(template){
    
    
      switch(template.type){
          
          case "circle":
          
            return <Circle key={template.id} id={template.id}/>
          
          case "ellipse":
            return <Ellipse key={template.id} id={template.id}/>

          case "rect":
            return <Rect key={template.id} id={template.id}/>

          case "path":
            return <Path key={template.id} id={template.id}/>
          
          case "text":
            return <Text key={template.id} id={template.id}/>
          
          case "line":
            return <Line key={template.id} id={template.id}/>

          case "group":
            return <Group key={template.id} id={template.id} />

       }
      
       return null;

  }


  renderTemplates(){
    console.log("IN RENDER TEMPLATES WITH");
    console.log(this.props);

    const {[NAME]:{templates, templatesById, selected}} = this.props;

    return templates.map((key)=>{
       return this.renderTemplate(templatesById[key]);
    });
  }
  
  render() {
   
  	const {w,h,ow,oh, view, connectDropTarget} = this.props;

    return connectDropTarget(
      <div onMouseMove={this._onMouseMove} className="canvas">
         <svg id="svgchart" viewBox={`0 0 ${ow} ${oh}`} width={w} height={h} onMouseUp={this.onMouseUp}>
            {view==="editor" && this.renderTemplates()} 
            {view==="live" && this.renderNodes()} 
          </svg>
      </div>
    );
  }

  _handleKeyDown(e) {
      var rx = /INPUT|SELECT|TEXTAREA|DIV/i;
      if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                this.deletePressed();
                e.preventDefault();
            }
      }
  }

}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(EditorCanvas));
