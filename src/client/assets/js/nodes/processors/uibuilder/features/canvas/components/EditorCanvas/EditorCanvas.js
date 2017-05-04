import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector, NAME } from '../../';
import './Canvas.scss';
import {Circle,Ellipse,Text,Rect,Line,Path,Group} from '../svg/';
import { DropTarget } from 'react-dnd';
import { bindNodeIds } from 'utils/utils';
//import {PALETTE_WIDTH} from 'features/palette/constants';
const PALETTE_WIDTH = 150;

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
      props.dispatch(canvasActions.templateDropped(props.nid, template,(x-100),y))
    }else{
      props.dispatch(canvasActions.groupTemplateDropped(props.nid, children, (x-100), y))
    }
  }
};

const ItemTypes = {
  TEMPLATE: 'template'
};

class EditorCanvas extends Component {

  constructor(props, context){
  	super(props, context);
    const {nid, dispatch} = props;

  	this._onMouseMove = this._onMouseMove.bind(this);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove.bind(null,nid), dispatch);
    this.onMouseUp = bindActionCreators(canvasActions.onMouseUp.bind(null,nid), dispatch);
    this.deletePressed = bindActionCreators(canvasActions.deletePressed.bind(null,nid), dispatch);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    //window.addEventListener('keydown', this._handleKeyDown);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    //console.log(`${clientX},${clientY}`);
    this.mouseMove(clientX-PALETTE_WIDTH,clientY);
  }

  renderTemplate(template){
    
      const {nid} = this.props;

      const props = {
          id: template.id,
          nid,
      }

      switch(template.type){
          
          case "circle":
          
            return <Circle key={template.id} {...props}/>
          
          case "ellipse":
            return <Ellipse key={template.id} {...props}/>

          case "rect":
            return <Rect key={template.id} {...props}/>

          case "path":
            return <Path key={template.id} {...props}/>
          
          case "text":
            return <Text key={template.id} {...props}/>
          
          case "line":
            return <Line key={template.id} {...props}/>

          case "group":
            return <Group key={template.id} {...props} />

       }
      
       return null;

  }


  renderTemplates(){

    const {[NAME]:{templates, templatesById, selected}} = this.props;

    return templates.map((key)=>{
       return this.renderTemplate(templatesById[key]);
    });
  }
  
  render() {
   
  	const {w,h,ow,oh, view, connectDropTarget} = this.props;

    return connectDropTarget(
      <div tabIndex="0"  onKeyDown={this._handleKeyDown} onMouseMove={this._onMouseMove} className="canvas">
         <svg id="svgchart" viewBox={`0 0 ${ow} ${oh}`} width={w} height={h} onMouseUp={this.onMouseUp}>
            {view==="editor" && this.renderTemplates()} 
            {view==="live" && this.renderNodes()} 
          </svg>
      </div>
    );
  }

  _handleKeyDown(e) {
      console.log("seen handle key down");
      console.log(e.which);
      e.preventDefault();
      const {nid} = this.props;
      var rx = /INPUT|SELECT|TEXTAREA/i;
      console.log(e.target.tagName);

      if( e.which == 8 ){ // 8 == backspace
            console.log("BACKSPACE!!");
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                console.log("nice am here");
                this.deletePressed();
            }
      }
  }

}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(EditorCanvas));
