import React from 'react';
import { connect } from 'react-redux';
import NodeInfo from '../components/NodeInfo';
import RepoManager from './RepoManager';
import TestManager from './TestManager';
import {closeSideBar} from '../actions/SidebarActions';
import { bindActionCreators } from 'redux';

class Sidebar extends React.Component {

	constructor(props){
		super(props)
		this.closeSideBar = bindActionCreators(closeSideBar, props.dispatch);
	}
	
	render() {
		
		const { node, shownodedetails, showappmanager, showtest, dispatch } = this.props;
		
	
		if ((!shownodedetails && !showappmanager && !showtest)){
			return null;
		}
		
		let content;
		
		if (showappmanager){
			content = <RepoManager />
		}
		else if (shownodedetails){
			content = <NodeInfo node={node}/>
		}
		else if (showtest){
			content = <TestManager />
		
		}

		const close = {
			display: 'flex',
			flexDirection: 'row',
			margin: '5px 10px 20px 0px',
			WebkitFlexDirection: 'row',
   			flexDirection: 'row',
   			WebkitJustifyContent:  'flex-end',
 		 	justifyContent: 'flex-end',
		}
		
		return( 
			 <div id="sidebar" style={{display:'block'}}>
			 	<div onClick={this.closeSideBar} style={close}> <i className="fa fa-times fa-fw"></i> </div>
        		{content}
        		<div id="sidebar-footer"></div>
    		</div>
		);
	}
}


function select(state) {
  return {
    node: state.nodes.selected,
    shownodedetails: state.editor.nodedetails,
    showappmanager: state.editor.appmanager,
    showtest: state.editor.testdeploy,
  };
}

export default connect(select)(Sidebar);