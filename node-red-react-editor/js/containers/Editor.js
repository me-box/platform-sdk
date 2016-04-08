import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes}  from '../actions/NodeActions';
import {dropNode} from '../actions/NodeActions';
import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from '../components/Sidebar';
import DragDropContainer from './DragDropContainer';
import '../../style/sass/style.scss';
import '../../style/font-awesome/css/font-awesome.min.css';
import '../../style/bootstrap/css/bootstrap.min.css';


class Editor extends Component {

  constructor(props){
  	super(props)
  } 

  render() {

  	
  	const {store} = this.context;
   	const { types, dispatch } = this.props;
   	const paletteprops =  {
  		types,
  		dropNode: bindActionCreators(dropNode, dispatch),
  	}


   	return (<div onClick={bindActionCreators(fetchNodes.bind(this,store), dispatch)}> 
	    		<div id="main-container-old" className="sidebar-closed-old ">
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
