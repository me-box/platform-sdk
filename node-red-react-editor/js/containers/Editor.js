import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes, dropNode}  from '../actions/NodeActions';
import {deletePressed} from '../actions/KeyboardActions';
import {windowResize} from '../actions/WindowActions';

import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from './Sidebar';
import Toolbar from '../components/Toolbar';
import DragDropContainer from './DragDropContainer';
import RepoManager from './RepoManager';

import {PALETTE_WIDTH, HELP_WIDTH, TOOLBAR_HEIGHT} from '../constants/ViewConstants';
import '../../style/font-awesome/css/font-awesome.min.css';
import '../../style/bootstrap/css/bootstrap.min.css';
import '../../style/sass/style.scss';

class Editor extends Component {

  constructor(props){
  	super(props);
    this._handleResize = this._handleResize.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  } 

  componentDidMount(){
  	//TODO: check state to ensure only happens once!
  	const {store} = this.context;

    //this is the place that kicks of loading all of the node red node types!
  	bindActionCreators(fetchNodes.bind(this,store), this.props.dispatch)()
    this.deletePressed = bindActionCreators(deletePressed, this.props.dispatch);
    this.windowResize  = bindActionCreators(windowResize, this.props.dispatch);

    window.addEventListener('keydown', this._handleKeyDown);
  	window.addEventListener('resize', this._handleResize);
  
  }

  componentWillUnmount(){
      window.removeEventListener('resize', this._handleResize);
      window.removeEventListener('keydown', this._handleKeyDown);
  }

  render() {

  	
  	const {store} = this.context;
   	const { types, categories, dimensions, dispatch } = this.props;

   	const paletteprops =  {
  		types,
        categories,
  		dropNode: bindActionCreators(dropNode.bind(this,store), dispatch),
  	}

    const workspaceprops = {
      w: dimensions.w - PALETTE_WIDTH - HELP_WIDTH,
      h: dimensions.h - TOOLBAR_HEIGHT,
    }


   	return (<div onKeyDown={this._keyPress}> 
				<Toolbar />
	    		<div id="main-container" className="sidebar-closed">
	    			<DragDropContainer>
	    				<Palette {...paletteprops}/>
	    				<Workspace {...workspaceprops}/>
	    			</DragDropContainer>
            		<Sidebar />
            		<RepoManager />
	    		</div>
	    	</div>);
    }

    _handleKeyDown(e) {
       var rx = /INPUT|SELECT|TEXTAREA/i;
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
  };
}

Editor.contextTypes = {
	store: React.PropTypes.object,
}

export default connect(select)(Editor);
