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
      props.dispatch(canvasActions.templateDropped(props.nid, template,x,y))
    }else{
      props.dispatch(canvasActions.groupTemplateDropped(props.nid, children, x, y))
    }
  }
};

const ItemTypes = {
  TEMPLATE: 'template'
};


const canvasdim = (w, h, aspect)=>{
  const padding = 0;//15;
  let boxw, boxh;

  if (w < h){
      boxw = w-(padding*2);
      boxh = boxw / aspect;
  }else{
      boxh = h-(padding*2);
      boxw = boxh * aspect;
  }

  return {w:boxw, h:boxh};
}


class EditorCanvas extends Component {

  constructor(props, context){
  	super(props, context);
    const {nid, dispatch} = props;

  	this._onMouseMove = this._onMouseMove.bind(this);
    this._setOffset = this._setOffset.bind(this);
    this.setOffset = bindActionCreators(canvasActions.setOffset.bind(null,nid), dispatch);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove.bind(null,nid), dispatch);
    this.onMouseUp = bindActionCreators(canvasActions.onMouseUp.bind(null,nid), dispatch);
    //window.addEventListener('keydown', this._handleKeyDown);
  }	

  _setOffset(input){
    if (input){
      const {left, top} = input.getBoundingClientRect();
      this.setOffset(left,top); //name field
    }
  }

  _onMouseMove(e){
    const {[NAME]:{offset}} = this.props;
    const {clientX, clientY} = e;
    const x = clientX-offset.left;
    const y = clientY-offset.top;
    this.mouseMove(x,y);
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

  shouldComponentUpdate(nextProps, nextState){
    return this.props !== nextProps;
  }

  renderTemplates(){

    const {[NAME]:{templates, templatesById, selected}} = this.props;

    return templates.map((key)=>{
       return this.renderTemplate(templatesById[key]);
    });
  }
  
  render() {
   //viewBox={`0 0 ${originaldim.w} ${originaldim.h}`} 
  	const {w,h,ow,oh,view,aspect,connectDropTarget} = this.props;

    const currentdim = canvasdim(w,h, aspect);
    const originaldim = canvasdim(ow,oh, aspect);

    const margin = `${Math.floor((h-currentdim.h)/2)}px ${Math.floor((w-currentdim.w)/2)}px`
    //   <div>{`original:${originaldim.w}x${originaldim.h} -> current:${currentdim.w}x${currentdim.h}`}</div>
    return connectDropTarget(
      <div style={{width:w, height:h}} className="canvas">
         <div  ref={this._setOffset} onMouseMove={this._onMouseMove} style={{overflow:'auto', margin:margin, height:currentdim.h, width: currentdim.w, border:"1px solid black"}}>
            <svg id="svgchart"  width={originaldim.w} height={originaldim.h} onMouseUp={this.onMouseUp}>
              {view==="editor" && this.renderTemplates()} 
              {view==="live" && this.renderNodes()} 
            </svg>
          </div>
      </div>
    );
  }

}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(EditorCanvas));
