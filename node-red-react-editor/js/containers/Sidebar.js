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
		
		const { node, shownodedetails, showappmanager, showdebugger, dispatch } = this.props;
		
	
	
		if (!showappmanager){
			return null;
		}
		
		let content;
		
		//if (showappmanager){
			//content = <RepoManager />
		//}
	    //if (shownodedetails){
		//	content = <NodeInfo node={node}/>
		//}
		if (showdebugger){
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
			 <div id="sidebar" style={{display:'block', height: this.props.h}}>
			 	<div onClick={this.closeSideBar} style={close}> <i className="fa fa-times fa-fw"></i> </div>
				<div id="sidebar-content">
					{content}
				</div>
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
    showdebugger: state.editor.dbg,
  };
}

export default connect(select)(Sidebar);