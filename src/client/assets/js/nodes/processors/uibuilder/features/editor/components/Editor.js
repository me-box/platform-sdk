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

		  this._handleResize = this._handleResize.bind(this);
      this._handleLive = this._handleLive.bind(this);
      this._handleEdit = this._handleEdit.bind(this);
      this._handleSave = this._handleSave.bind(this);
      this._handleLoad = this._handleLoad.bind(this);
      this._closeDialog = this._closeDialog.bind(this);
      this._openLoadDialog = this._openLoadDialog.bind(this);
      this._handleKeyDown = this._handleKeyDown.bind(this);

      this.state = {load:false};

   }		
  	
    componentDidMount(){
		  //window.addEventListener('resize', this._handleResize);
  	}

/*    render() {
      const {w,h,ow,oh,view} = {w:500,h:500,ow:500,oh:500,view:"editor"};
      const {store} = this.props;

      return (
        <div className="editor">
          <EditorCanvas w={w} h={h} ow={ow} oh={oh} view={view} store={store}/>
        </div>
      )

    }*/

    render() {
           

      const {[NAME]:{w,h,ow,oh,view},actions:{setView},store, canvasheight, canvaswidth, nid, inputs} = this.props;
   

      const canvasstyle ={
        left: PALETTE_WIDTH,
        //width: w-PALETTE_WIDTH,
      }

      const actions = [
                        <Button flat key="load" label="load" onClick={this._openLoadDialog}>cloud_download</Button>,
                        <Button flat key="save" label="save" onClick={this._handleSave}>save</Button>
                      ]

     

      if (view === "editor"){
        actions.push(<Button flat key="toggle" label="live" onClick={this._handleLive}>tap_and_play</Button>);
      }else{
        actions.push(<Button flat key="toggle" label="editor" onClick={this._handleEdit}>mode_edit</Button>);
      }

      const toolbarwidth = view==="editor" ? w-MAPPER_WIDTH-PALETTE_WIDTH : w-PALETTE_WIDTH;


      return (
        <div className="uieditor" tabIndex="0"  onKeyDown={this._handleKeyDown}>
            <Palette nid={nid} h={canvasheight}/>
            <div className="canvascontainer" style={canvasstyle}>
                {view==="editor" && <EditorCanvas nid={nid} store={store} w={canvaswidth} h={canvasheight} ow={ow} oh={oh} view={view}/>}
            </div> 
            {view==="editor" && <Mapper nid={nid} h={canvasheight} inputs={inputs}/>}
            <Toolbar colored title={view} actions={actions} style={{position:"relative", bottom:100, background:"#3f51b5"}}/>
            <LoadScene store={store} nid={nid} visible={this.state.load} onHide={this._closeDialog} onLoad={this._handleLoad}/>
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
        const {nid} = this.props;
     	  const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      	const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      	this.props.actions.screenResize(nid,w,h);
  	}

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
    }
}