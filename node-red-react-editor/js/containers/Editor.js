import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes}  from '../actions/NodeActions';
import {dropNode} from '../actions/NodeActions';
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
  	
  	//might be able tro get rid of bind to store here, as better to do register reducers with store at
  	//point node is dropped into workspace
  	bindActionCreators(fetchNodes.bind(this,store), this.props.dispatch)()
  }

  render() {

  	
  	const {store} = this.context;
   	const { types, dispatch } = this.props;
   	const paletteprops =  {
  		types,
  		dropNode: bindActionCreators(dropNode.bind(this,store), dispatch),
  	}

   	return (<div> 
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
    types: state.types
  };
}

Editor.contextTypes = {
	store: React.PropTypes.object,
}

export default connect(select)(Editor);
