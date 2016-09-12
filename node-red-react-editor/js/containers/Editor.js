import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes, dropNode}  from '../actions/NodeActions';
import {deletePressed} from '../actions/KeyboardActions';
import {windowResize} from '../actions/WindowActions';
import {init} from '../actions/EditorActions'; 
import {addTab, selectTab, updateTab} from '../actions/TabActions';
import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from './Sidebar';
import Toolbar from '../components/Toolbar';
import DragDropContainer from './DragDropContainer';
import Publisher from './Publisher';
import NetworkStatus from '../components/NetworkStatus';


import {PALETTE_WIDTH, SIDEBAR_WIDTH, TOOLBAR_HEIGHT} from '../constants/ViewConstants';
import '../../style/font-awesome/css/font-awesome.min.css';
import '../../style/bootstrap/css/bootstrap.min.css';
import '../../style/sass/style.scss';

class Editor extends Component {

  constructor(props){
  	super(props);
    this._handleResize = this._handleResize.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this.deletePressed = bindActionCreators(deletePressed, props.dispatch);
    this.windowResize  = bindActionCreators(windowResize, props.dispatch);
  	this.addTab = bindActionCreators(addTab, props.dispatch);
  	this.selectTab = bindActionCreators(selectTab, props.dispatch);
  	this.updateTab = bindActionCreators(updateTab, props.dispatch);
  } 

  componentDidMount(){
  	//TODO: check state to ensure only happens once!
  	const {store} = this.context;

    //this is the place that kicks of loading all of the node red node types!
  	bindActionCreators(fetchNodes.bind(this,store), this.props.dispatch)()
    window.addEventListener('keydown', this._handleKeyDown);
  	window.addEventListener('resize', this._handleResize);
  	
  	//send action to tell reducers that editor has just loaded (publisher reducer will use this to create a new appID)
  	this.props.dispatch(init());
  	this.addTab();
  }

  componentWillUnmount(){
      window.removeEventListener('resize', this._handleResize);
      window.removeEventListener('keydown', this._handleKeyDown);
  }

  render() {

  	
  	const {store} = this.context;
   	const { types, tabs, currentTab,sidebarExpanded, showPublisher, categories, dimensions, status, dispatch } = this.props;

   	const paletteprops =  {
  		types,
        categories,
  		dropNode: bindActionCreators(dropNode.bind(this,store), dispatch),
  	}

    const workspaceprops = {
      w: dimensions.w - PALETTE_WIDTH,
      h: dimensions.h - TOOLBAR_HEIGHT,
      tabs,
      currentTab,
      sidebarExpanded,
      addTab: this.addTab,
      selectTab: this.selectTab,
      updateTab: this.updateTab,
    }
    
    const networkstatusprops = {
      status,
    }

	let publisher;
	
	if (showPublisher){
	  publisher = <Publisher />
	}
	
	
   	return (<div onKeyDown={this._keyPress}> 
				<Toolbar />
	    		<div id="main-container" className="sidebar-closed">
	    			<DragDropContainer>
	    				
	    				<Palette {...paletteprops}/>
	    				
	    				<Workspace {...workspaceprops}/>
	    				
	    				{publisher}
	    			</DragDropContainer>
            		<Sidebar h={dimensions.h-TOOLBAR_HEIGHT}/>
            		<NetworkStatus {...networkstatusprops}/>
	    		</div>
	    	</div>);
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

    _handleResize(e){
      const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      this.windowResize(w,h);
    }
}



function select(state) {
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

Editor.contextTypes = {
	store: React.PropTypes.object,
}

export default connect(select)(Editor);
