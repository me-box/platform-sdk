import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchComponent}  from '../actions/NodeActions';
import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from '../components/Sidebar';
import DragDropContainer from './DragDropContainer';
import '../../style/sass/style.scss';
import '../../style/font-awesome/css/font-awesome.min.css';
import '../../style/bootstrap/css/bootstrap.min.css';

/* /*return (
    	<div onClick={bindActionCreators(fetchNodes, dispatch)}>
	    	<div id="main-container" className="sidebar-closed ">
	    		<Palette nodes={nodes}/>
	  			<Workspace />
	  			<Sidebar />
	    		<div id="sidebar-separator"></div>
			</div>
			
			<div id="notifications"></div>
			
			<div id="dropTarget">
				<div data-i18n="[append]workspace.dropFlowHere"><br/>
					<i className="fa fa-download"></i>
				</div>
			</div>
		</div>
    );*/

      

class Editor extends Component {
 

  render() {
  	const {store} = this.context;
   	const { types, dispatch } = this.props;
   	return (<div onClick={bindActionCreators(fetchComponent.bind(this,store), dispatch)}> //need to bind tsore too!
	    		<div id="main-container-old" className="sidebar-closed-old ">
	    			<DragDropContainer>
	    				<Palette types={types}/>
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
