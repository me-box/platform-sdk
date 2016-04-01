import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {fetchNodes}  from '../actions/NodeActions';
import Palette from '../components/Palette';
import Workspace from '../components/Workspace';
import Sidebar from '../components/Sidebar';

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
    console.log("OK NEW FOR SUE!");
    const { nodes, dispatch } = this.props;
   return (<div onClick={bindActionCreators(fetchNodes, dispatch)}>
	    		<div id="main-container" className="sidebar-closed ">
	    			<Palette nodes={nodes}/>
	    		</div>
	    	</div>);
  
  }
}

function select(state) {
  return {
    nodes: state.nodes
  };
}

export default connect(select)(Editor);
