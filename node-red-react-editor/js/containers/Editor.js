import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes, dropNode}  from '../actions/NodeActions';
import {deletePressed} from '../actions/KeyboardActions';
import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from '../components/Sidebar';
import Toolbar from '../components/Toolbar';

import DragDropContainer from './DragDropContainer';

import '../../style/font-awesome/css/font-awesome.min.css';
import '../../style/bootstrap/css/bootstrap.min.css';
import '../../style/sass/style.scss';

class Editor extends Component {

  constructor(props){
  	super(props)
  } 

  componentDidMount(){
  	//TODO: check state to ensure only happens once!
  	const {store} = this.context;
  	bindActionCreators(fetchNodes.bind(this,store), this.props.dispatch)()
    bindActionCreators(deletePressed, this.props.dispatch);
    window.addEventListener('keydown', function (e) {
       var rx = /INPUT|SELECT|TEXTAREA/i;
       if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                this.props.dispatch(deletePressed());
                e.preventDefault();
            }
      }
    }.bind(this));
  	//this is the place that kicks of loading all of the node red node types!
  	
  }

  render() {

  	
  	const {store} = this.context;
   	const { types, categories, dispatch } = this.props;

   	const paletteprops =  {
  		types,
      categories,
  		dropNode: bindActionCreators(dropNode.bind(this,store), dispatch),
  	}

   	return (<div onKeyDown={this._keyPress}> 
				<Toolbar />
	    		<div id="main-container" className="sidebar-closed">
	    			<DragDropContainer>
	    				<Palette {...paletteprops}/>
	    				<Workspace />
	    			</DragDropContainer>
	    		</div>
	    	</div>);
  
  }
}

function select(state) {
  return {
    types: state.types.nodetypes,
    categories: state.types.categories,
  };
}

Editor.contextTypes = {
	store: React.PropTypes.object,
}

export default connect(select)(Editor);
