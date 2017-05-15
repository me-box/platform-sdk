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
      this.state = {load:false, aspect:1440/900};//, ow:w, oh:h};

   }    
    
    componentDidMount(){
      const {canvasheight, canvaswidth} = this.props;
      window.addEventListener('resize', this._handleResize);
      if (!this.props.originaldimensions){
        this.props.updateNode("canvasdimensions",{w:canvaswidth, h:canvasheight});
      }
    }

    render() {
           
   
      const {[NAME]:{w,h,view},actions:{setView},store, originaldimensions, canvasheight, canvaswidth, nid, inputs} = this.props;
      const originalcanvasheight = originaldimensions ? originaldimensions.h : canvasheight;
      const originalcanvaswidth = originaldimensions ? originaldimensions.w  : canvaswidth;
    
      const canvasstyle ={
        left: PALETTE_WIDTH,
        height: canvasheight,
        width: canvaswidth,
      }

      const actions = [
          <Button flat key="aspect_mobile" onClick={()=>{this.setState({aspect:750/1334})}}>phone_android</Button>,
          <Button flat key="aspect_tablet" onClick={()=>{this.setState({aspect:750/1334})}}>tablet_android</Button>,
          <Button flat key="aspect_screen" onClick={()=>{this.setState({aspect:1440/900})}}>laptop</Button>,
          <Button flat key="aspect_rotate" onClick={()=>{}}>screen_rotation</Button>,
      ]


      return (
        <div className="uieditor" tabIndex="0"  onKeyDown={this._handleKeyDown}>
            <Palette nid={nid} h={canvasheight}/>
            <div className="canvascontainer" style={canvasstyle}>
                {view==="editor" && <EditorCanvas nid={nid} store={store} w={canvaswidth} aspect={this.state.aspect} h={canvasheight} ow={originalcanvaswidth} oh={originalcanvasheight} view={view}/>}
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
                console.log("nice am here");
                this.props.actions.deletePressed(nid);
                e.preventDefault();
            }
      }
    }

    _handleResize(e){
        const {canvasheight, canvaswidth} = this.props;
        if (!this.props.originaldimensions){
          this.props.updateNode("canvasdimensions",{w:canvaswidth, h:canvasheight});
        }
    }

}