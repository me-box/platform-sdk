import React from 'react';
import { connect } from 'react-redux';
import NodeInfo from '../components/NodeInfo';
import RepoManager from './RepoManager';

class Sidebar extends React.Component {
	render() {
		
		const { node, showappmanager, dispatch } = this.props;
		
	
		if (!node && !showappmanager){
			return null;
		}
		
		let content;
		
		if (showappmanager){
			content = <RepoManager />
		}
		else if (node){
			content = <NodeInfo node={node}/>
		}

		return( 
			 <div id="sidebar" style={{display:'block'}}>
        		{content}
        		<div id="sidebar-footer"></div>
    		</div>
		);
	}
}


function select(state) {
  return {
    node: state.nodes.selected,
    showappmanager: state.editor.appmanager,
  };
}

export default connect(select)(Sidebar);