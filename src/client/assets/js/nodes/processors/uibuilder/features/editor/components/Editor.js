import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as editorActions, selector, NAME } from '../';
//import { actionCreators as sourceActions} from 'features/sources';
//import { actionCreators as mapperActions} from 'features/mapper';
import EditorCanvas from '../../canvas/components/EditorCanvas';
//import LiveCanvas from '../../live/components/LiveCanvas';

import Palette from '../../palette/components';
import Mapper from '../../mapper/components/Mapper';
import DragDropContainer from 'nodes/processors/uibuilder/components/DragDrop';
import './Editor.scss';
//import {DatasourceManager} from '../../../datasources';
import LoadScene from './LoadScene';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
//import {MAPPER_WIDTH} from '../../mapper/constants';
//import {PALETTE_WIDTH} from '../../palette/constants';

const PALETTE_WIDTH = 60;
const MAPPER_WIDTH = 150;


//const canvasdimensions = ()=>{
//   const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//   const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
 //  return {w,h};
//};

@connect(selector, (dispatch) => {
  /*DatasourceManager.init(bindActionCreators(sourceActions.registerSource, dispatch));*/
  return{
     actions: {...bindActionCreators(editorActions, dispatch)}
     //, ...bindActionCreators(mapperActions, dispatch)}
  }
})

export default class Editor extends Component {

   constructor(props,context){
      super(props,context);
      const {nid, dispatch} = props;
      //const {w,h} = canvasdimensions();

      this._handleResize = this._handleResize.bind(this);
      //this._handleLive = this._handleLive.bind(this);
      //this._handleEdit = this._handleEdit.bind(this);
      //this._handleSave = this._handleSave.bind(this);
      //this._handleLoad = this._handleLoad.bind(this);
      //this._closeDialog = this._closeDialog.bind(this);
      //this._openLoadDialog = this._openLoadDialog.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);
      this.state = {load:false, aspect:1440/900};//, ow:w, oh:h};

   }    
    
    componentDidMount(){
      const {canvasheight, canvaswidth} = this.props;
      window.addEventListener('resize', this._handleResize);
      if (!this.props.originaldimensions){
        //const {w,h} = canvasdimensions();
        //this.setState({ow:w, oh:h});
        console.log("AM UPDATING CANVAS DIMENSIONS!!");
        this.props.updateNode("canvasdimensions",{w:canvaswidth, h:canvasheight});
      }
    }

    render() {
           
      
      const {[NAME]:{w,h,view},actions:{setView},store, originaldimensions, canvasheight, canvaswidth, nid, inputs} = this.props;
      const originalcanvasheight = originaldimensions ? originaldimensions.h : canvasheight;
      const originalcanvaswidth = originaldimensions ? originaldimensions.w  : canvaswidth;
      const currentcanvasheight = canvasheight;
      const currentcanvaswidth  = canvaswidth; 


      const canvasstyle ={
        left: PALETTE_WIDTH,
        height: canvasheight,
        width: canvaswidth,
        //overflow: 'auto',
        //width: w-PALETTE_WIDTH,
      }

      const actions = [
          <Button flat key="aspect_mobile" onClick={()=>{this.setState({aspect:750/1334})}}>phone_android</Button>,
          <Button flat key="aspect_tablet" onClick={()=>{this.setState({aspect:750/1334})}}>tablet_android</Button>,
          <Button flat key="aspect_screen" onClick={()=>{this.setState({aspect:1440/900})}}>laptop</Button>,
          <Button flat key="aspect_rotate" onClick={()=>{}}>screen_rotation</Button>,
      ]

      /*
       
            <LoadScene store={store} nid={nid} visible={this.state.load} onHide={this._closeDialog} onLoad={this._handleLoad}/>*/

    //  <Toolbar colored title={view} actions={actions}/>

      return (
        <div className="uieditor" tabIndex="0"  onKeyDown={this._handleKeyDown}>
            <Palette nid={nid} h={canvasheight}/>
            <div className="canvascontainer" style={canvasstyle}>
                {view==="editor" && <EditorCanvas nid={nid} store={store} w={canvaswidth} aspect={this.state.aspect} h={canvasheight} ow={originalcanvaswidth} oh={originalcanvasheight} view={view}/>}
            </div> 
            {view==="editor" && <Mapper nid={nid} h={canvasheight} inputs={inputs}/>}
        </div>
      );
    }

    _handleKeyDown(e) {
      console.log("seen handle key down");
      console.log(e.which);
      
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
        //const {nid} = this.props;
        const {canvasheight, canvaswidth} = this.props;
        //window.addEventListener('resize', this._handleResize);
        if (!this.props.originaldimensions){
        //const {w,h} = canvasdimensions();
        //this.setState({ow:w, oh:h});
          console.log("AM UPDATING CANVAS DIMENSIONS!!");
          this.props.updateNode("canvasdimensions",{w:canvaswidth, h:canvasheight});
        }
        //const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        //const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        //this.props.actions.screenResize(nid,w,h);
        //console.log("in handle resize!!");
    }
/*
   _handleEdit(){
      const {nid} = this.props;
      this.props.actions.unsubscribeMappings();
      this.props.actions.setView(nid,"editor")
    }

    _handleLive(){
      const {nid} = this.props;
      this.props.actions.subscribeMappings();
      this.props.actions.setView(nid,"live")
    }

    _handleSave(){
      const {nid} = this.props;
      this.props.actions.save(nid);
    }

    _handleLoad(scene){
      const {nid} = this.props;
      this.setState({load:false});
      this.props.actions.load(nid,scene);
    }

    _openLoadDialog(){
      this.setState({load:true});
    }

    _closeDialog(){
      this.setState({load:false});
    }*/
}