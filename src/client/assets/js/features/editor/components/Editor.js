import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Palette} from 'features/palette/components';
import {Workspace} from 'features/workspace/components';
import NetworkStatus from 'features/network/components';

import {NAME, actionCreators as editorActions, selector } from '../';
import {PALETTE_WIDTH, SIDEBAR_WIDTH, TOOLBAR_HEIGHT} from 'constants/ViewConstants';
import DragDropContainer from './DragDropContainer';
import Toolbar from './Toolbar';
import {actionCreators as repoActions} from 'features/repos/actions';
import {actionCreators as workspaceActions} from 'features/workspace';
import {actionCreators as testActions} from 'features/test';
import {actionCreators as paletteActions} from 'features/palette';
import {actionCreators as exampleActions} from 'features/examples';


import RepoManager from 'features/repos/components/RepoManager';
import ExampleManager from 'features/examples/components/ExampleManager';
import Publisher from 'features/workspace/components/Publisher';
import TestManager from 'features/test/components/TestManager';
import Help from 'features/help/components/Help';
import ServerConsole from 'features/serverconsole/components/ServerConsole';

@connect((state)=>{
    return {
        editor: state[NAME],
        publishervisible: state.workspace.publishervisible,
    }
  }, (dispatch) => {    
  return{
     actions:{...bindActionCreators(editorActions, dispatch), 
              clear: bindActionCreators(editorActions.clear, dispatch),
              requestCode: bindActionCreators(paletteActions.requestCode, dispatch),
              requestRepos: bindActionCreators(repoActions.requestRepos, dispatch),
              toggleSaveDialogue: bindActionCreators(repoActions.toggleSaveDialogue, dispatch),
              toggleSaveAsDialogue: bindActionCreators(repoActions.toggleSaveAsDialogue, dispatch),
              togglePublisher: bindActionCreators(workspaceActions.togglePublisher, dispatch),
              toggleExamples: bindActionCreators(exampleActions.toggleVisible, dispatch),
              test: bindActionCreators(testActions.test, dispatch),

              }
    }
})
export default class Editor extends Component {

  
  constructor(props){
  	super(props);
    this._handleResize = this._handleResize.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  } 

  componentDidMount(){
  	
    //this is the place that kicks of loading all of the node red node types!
    window.addEventListener('keydown', this._handleKeyDown);
  	window.addEventListener('resize', this._handleResize);
  	this.props.actions.initEditor();
 
  }

  componentWillUnmount(){
      window.removeEventListener('resize', this._handleResize);
      window.removeEventListener('keydown', this._handleKeyDown);
  }
  /*
  return (<div onKeyDown={this._keyPress}> 
          <Toolbar {...toolbarprops}/>
          
          <DragDropContainer>
           <div id="main-container" className="sidebar-closed">
              <Palette />
              <Workspace/>
              {publishervisible && <Publisher/>}
           </div>
          </DragDropContainer>
          <NetworkStatus/>
          <RepoManager h={h-TOOLBAR_HEIGHT}/>
          <TestManager h={h-TOOLBAR_HEIGHT}/>
          <ExampleManager h={h-TOOLBAR_HEIGHT}/>}
          <Help h={h-TOOLBAR_HEIGHT} w={w} />
        </div>);*/

  render() {

   
    const {editor:{screen:{w,h}}, publishervisible} = this.props;
		
    const toolbarprops  = {
        ...this.props.actions
    }

    return (<div onKeyDown={this._keyPress}> 
              <DragDropContainer>
               <div id="main-container" className="sidebar-closed">
                  <Palette />
                  <Workspace/>
                  {publishervisible && <Publisher/>}
               </div>
              </DragDropContainer>
              <NetworkStatus/>
              <RepoManager h={h-TOOLBAR_HEIGHT}/>
              <TestManager h={h-TOOLBAR_HEIGHT}/>
              <ExampleManager h={h-TOOLBAR_HEIGHT}/>
              <ServerConsole h={h-TOOLBAR_HEIGHT} w={w} />
              <Help h={h-TOOLBAR_HEIGHT} w={w} />
              <Toolbar {...toolbarprops}/>

            </div>)
  }


    _handleKeyDown(e) {
       var rx = /INPUT|SELECT|TEXTAREA|DIV/i;
       if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                this.props.actions.deletePressed();
                e.preventDefault();
            }
       }
    }

    _handleResize(e){
      const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.props.actions.windowResize(w,h);
    }
}




