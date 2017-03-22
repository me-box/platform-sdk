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

import RepoManager from 'features/repos/components/RepoManager';
import Publisher from 'features/workspace/components/Publisher';
import TestManager from 'features/test/components/TestManager';

console.log("in editor and network status is");
console.log(NetworkStatus);

@connect((state)=>{
    return {
        editor: state[NAME],
        publishervisible: state.workspace.publishervisible,
    }
  }, (dispatch) => {    
  return{
     actions:{...bindActionCreators(editorActions, dispatch), 
              requestRepos: bindActionCreators(repoActions.requestRepos, dispatch),
              toggleSaveDialogue: bindActionCreators(repoActions.toggleSaveDialogue, dispatch),
              togglePublisher: bindActionCreators(workspaceActions.toggleVisible, dispatch),
              test: bindActionCreators(testActions.test, dispatch),

              }
    }
})
export default class Editor extends Component {

  constructor(props){
  	super(props);
    this._handleResize = this._handleResize.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    //taken out for now..
    //this.windowResize  = bindActionCreators(editorActions.windowResize, props.dispatch);
 
  	//Object.assign(this, ...bindActionCreators(TabActions, props.dispatch));
  } 

  componentDidMount(){
  	
    //this is the place that kicks of loading all of the node red node types!
    window.addEventListener('keydown', this._handleKeyDown);
  	window.addEventListener('resize', this._handleResize);
  	
  	//send action to tell reducers that editor has just loaded (publisher reducer will use this to create a new appID)
  	this.props.actions.initEditor();
 
  }

  componentWillUnmount(){
      window.removeEventListener('resize', this._handleResize);
      window.removeEventListener('keydown', this._handleKeyDown);
  }

  render() {

    console.log("actions are");
    console.log(this.props.actions);

  	const {store} = this.context;
    const {editor:{screen:{w,h}}, publishervisible} = this.props;
   	/*const { types, tabs, currentTab,sidebarExpanded, showPublisher, categories, dimensions, status, dispatch } = this.props;

   	const paletteprops =  {
  		types,
      categories,
  		dropNode: bindActionCreators(dropNode.bind(this,store), dispatch),
  	}*/

   /* const workspaceprops = {
      w: dimensions.w - PALETTE_WIDTH,
      h: dimensions.h - TOOLBAR_HEIGHT,
      tabs,
      currentTab,
      sidebarExpanded,
      addTab: this.addTab,
      selectTab: this.selectTab,
      updateTab: this.updateTab,
      deleteTab: this.deleteTab,
    }*/
    
  /*  const networkstatusprops = {
      status,
    }

	let publisher;
	
	if (showPublisher){
	  publisher = <Publisher />
	}*/
	/*<RepoManager h={h-TOOLBAR_HEIGHT}/>*/
		
    const toolbarprops = {
       requestRepos: this.props.actions.requestRepos,
       toggleSaveDialogue: this.props.actions.toggleSaveDialogue,
       togglePublisher: this.props.actions.togglePublisher,
       test: this.props.actions.test,
    } 

   	return (<div onKeyDown={this._keyPress}> 
          <Toolbar {...toolbarprops}/>
	    		<div id="main-container" className="sidebar-closed">
	    			<DragDropContainer>
	    				<Palette />
              <Workspace />
              {publishervisible && <Publisher/>}
	    			</DragDropContainer>
	    		</div>
          <NetworkStatus/>
          <RepoManager h={h-TOOLBAR_HEIGHT}/>
          <TestManager h={h-TOOLBAR_HEIGHT}/>
	    	</div>);
    }


    /*
    return (<div onKeyDown={this._keyPress}> 
          <Toolbar />
          <div id="main-container" className="sidebar-closed">
            <DragDropContainer>
              
              <Palette {...paletteprops}/>
              
              <Workspace {...workspaceprops}/>
              
              {publisher}
            </DragDropContainer>
                <Sidebar h={dimensions.h-TOOLBAR_HEIGHT}/>
                <NetworkStatus />
                <RepoManager h={dimensions.h-TOOLBAR_HEIGHT}/>
          </div>
        </div>);*/


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
      //taken out for now
      //this.windowResize(w,h);
    }
}



/*function select(state) {
  return {
    types: state.types.nodetypes,
    categories: state.types.categories,
    dimensions: state.screen.dimensions,
    tabs: state.tabs.tabs,
    currentTab: state.tabs.current,
    sidebarExpanded: state.editor.sidebarExpanded,
    showPublisher: state.editor.publisher,
    status: state.network,
  };
}
*/

