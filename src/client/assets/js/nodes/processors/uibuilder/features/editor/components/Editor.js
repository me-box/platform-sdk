import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as editorActions, selector, NAME } from '../';
import EditorCanvas from '../../canvas/components/EditorCanvas';

import Palette from '../../palette/components';
import Mapper from '../../mapper/components/Mapper';
import DragDropContainer from 'nodes/processors/uibuilder/components/DragDrop';
import './Editor.scss';

import LoadScene from './LoadScene';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';


const PALETTE_WIDTH = 60;
const MAPPER_WIDTH = 150;
const PADDING = 30;

const canvasdim = (w, h, aspect)=>{
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

  return {w:boxw, h:boxh};
}


@connect(selector, (dispatch) => {

  return{
     actions: {...bindActionCreators(editorActions, dispatch)}
  }
})

export default class Editor extends Component {

   constructor(props,context){
      super(props,context);
      const {nid, dispatch} = props;
      
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this._handleResize = this._handleResize.bind(this);
      this.state = {load:false, aspect:1440/(900-64)};
   }    
    

    componentDidMount(){
      this._handleResize();
      window.addEventListener('resize', this._handleResize);
    }

    componentWillUnmount(){
      window.removeEventListener('resize', this._handleResize);
    }

    render() {
              
      const {[NAME]:{w,h},actions:{setView},store, canvasheight, canvaswidth, nid, inputs} = this.props;
    
      const canvasstyle ={
        left: PALETTE_WIDTH,
        height: canvasheight,
        width: canvaswidth,
      }

      const scaledcanvas = canvasdim(canvaswidth, canvasheight, this.state.aspect);
      const margin = `${Math.floor((canvasheight-scaledcanvas.h)/2)}px ${Math.floor((canvaswidth-scaledcanvas.w)/2)}px`
      
      const actions = [
          <Button flat key="aspect_mobile" onClick={()=>{this.setState({aspect:750/1334})}}>phone_android</Button>,
          <Button flat key="aspect_tablet" onClick={()=>{this.setState({aspect:750/1334})}}>tablet_android</Button>,
          <Button flat key="aspect_screen" onClick={()=>{this.setState({aspect:(1440-64)/900})}}>laptop</Button>,
          <Button flat key="aspect_rotate" onClick={()=>{}}>screen_rotation</Button>,
      ]


      return (
        <div className="uieditor" tabIndex="0"  onKeyDown={this._handleKeyDown}>
            <Palette nid={nid} h={canvasheight}/>
            <div className="canvascontainer" style={canvasstyle}>
                <EditorCanvas nid={nid} store={store} w={scaledcanvas.w} h={scaledcanvas.h} margin={margin} />
            </div> 
            <Mapper nid={nid} h={canvasheight} inputs={inputs}/>
        </div>
      );
    }

    _handleKeyDown(e) {
    
      const {nid} = this.props;
      var rx = /INPUT|SELECT|TEXTAREA/i;
      console.log(e.target.tagName);

      if( e.which == 8 ){ // 8 == backspace
            console.log("BACKSPACE!!");
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                
                this.props.actions.deletePressed(nid);
                e.preventDefault();
            }
      }
    }

    _handleResize(){
        const {canvaswidth,canvasheight} = this.props;
        const dim = canvasdim(canvaswidth,canvasheight,this.state.aspect);
        this.props.updateNode("canvasdimensions",{w:dim.w, h:dim.h});
    }

}