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
		
		const { node, showappmanager, showtesting, dispatch } = this.props;
		
		if (!showappmanager && !showtesting){
			return null;
		}
		let content = null;
		
		if (showappmanager){
			content = <RepoManager />
		}
		
		if (showtesting){
			content = <TestManager />
		}
		
		const close = {
			display: 'flex',
			flexDirection: 'row',
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
    showappmanager: state.editor.appmanager,
    showtesting: state.editor.testing,
  };
}

export default connect(select)(Sidebar);