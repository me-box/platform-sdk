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
const PADDING = 30;


const _originaldimensions = (dim, od)=>{
    return{
      ow : od ? od.w : dim.w,
      oh : od ? od.h : dim.h,
    } 
}

const _canvasdim = (w, h, aspect)=>{
  const _w = (w - PADDING*2);
  const _h = (h - PADDING*2);
  let boxw, boxh;

  if (aspect < 1){
      boxw = _w;
      boxh = boxw / aspect;
  }else{
      boxh = _h;
      boxw = boxh * aspect;
  }

  if (boxw > _w - PADDING*2){
    boxw = boxw - (boxw-_w) - PADDING*2;
    boxh = boxw / aspect;
  }

  return {w:Math.max(1,boxw), h:Math.max(1,boxh)};
}

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
    const {[NAME]:{offset}, w, h, od} = props;
    const {ow, oh} = _originaldimensions({w,h}, od);

    if (template !== "group"){
      props.dispatch(canvasActions.templateDropped(props.nid, template, (x-offset.left) * ow/w, (y-offset.top) * oh/h));
    }else{
      props.dispatch(canvasActions.groupTemplateDropped(props.nid, children, (x-offset.left) * ow/w, (y-offset.top) * oh/h));
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
    this._handleResize = this._handleResize.bind(this);
    this.rootNode = null;
    this.setOffset = bindActionCreators(canvasActions.setOffset.bind(null,nid), dispatch);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove.bind(null,nid), dispatch);
    this.onMouseUp = bindActionCreators(canvasActions.onMouseUp.bind(null,nid), dispatch);
    this.state = {aspect:1440/(900-64)};
  }	


  componentDidMount() {
    
    if (this.props.od === null){
        const dim = _canvasdim(this.props.w,this.props.h,this.state.aspect);
        this.props.updateNode("canvasdimensions",{w:dim.w, h:dim.h});
    }
    

    if (this.rootNode){
        const {left, top} = this.rootNode.getBoundingClientRect();
        this.setOffset(left,top-40); // name field=40
    }

    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  _handleResize(){
   
      const input = this.rootNode;
      const {[NAME]:{templates},w,h, od} = this.props;

      if (input){
        const {left, top} = input.getBoundingClientRect();
        this.setOffset(left,top-40); // name field=40
      }
      
      if ( templates.length <= 0 || od===null){
        const dim = _canvasdim(w,h,this.state.aspect);
        this.props.updateNode("canvasdimensions",{w:dim.w, h:dim.h});
      }

  }

  _onMouseMove(e){
    const {[NAME]:{offset}, w, h, od} = this.props;
    const dim = _canvasdim(w,h,this.state.aspect);
    const {ow, oh} = _originaldimensions(dim, od);

    const {clientX, clientY} = e;
    const x = (clientX-offset.left) * ow/dim.w;
    const y = (clientY-offset.top)  * oh/dim.h;
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
  
    const {w,h,od,connectDropTarget} = this.props;
    const dim = _canvasdim(w, h, this.state.aspect);
    const margin = `${Math.floor((h-dim.h)/2)}px ${Math.floor((w-dim.w)/2)}px`
    const {ow, oh} = _originaldimensions(dim, od);  

    return connectDropTarget(
      <div className="canvas">
         <div ref={node => this.rootNode = node} onMouseMove={this._onMouseMove} className="grid" style={{margin:margin, height:dim.h, width: dim.w, border:"1px solid black"}}>
            <svg id="svgchart"  width={dim.w} height={dim.h} viewBox={`0 0 ${ow} ${oh}`} onMouseUp={this.onMouseUp}>
              {this.renderTemplates()} 
            </svg>
          </div>
      </div>
    );
  }

}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(EditorCanvas));
