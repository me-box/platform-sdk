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

  componentDidMount(){
  	//TODO: check state to ensure only happens once!
  	const {store} = this.context;
  	bindActionCreators(fetchNodes.bind(this,store), this.props.dispatch)()
  }

  render() {

  	
  	
   	const { types, dispatch } = this.props;
   	const paletteprops =  {
  		types,
  		dropNode: bindActionCreators(dropNode, dispatch),
  	}


   	return (<div> 
   				<div id="header">
				 	<span className="logo">
						<a href="#"><span>databox app editor</span></a>
				 	</span>
				    <ul className="header-toolbar">
				    	<li>
				    		<span className="deploy-button-group button-group">
				    			<a id="btn-deploy" className="deploy-button" href="#">
				    			<img id="btn-deploy-icon" src="images/deploy-full-o.png"/> 
				    			<span>Deploy</span>
				    			</a>
				    			<a id="btn-deploy-options" data-toggle="dropdown" className="deploy-button" href="#">
				    				<i className="fa fa-caret-down"></i>
				    			</a>
				    			<ul id="btn-deploy-options-submenu" className="dropdown-menu pull-right">
				    				<li>
				    					<a id="deploymenu-item-full" href="#" className="active">
				    						<i className="fa fa-square pull-left"></i>
				    						<i className="fa fa-check-square pull-left"></i>
				    						<img src="images/deploy-full.png"/> 
				    						<span className="menu-label-container">
				    							<span className="menu-label">Full</span>
				    							<span className="menu-sublabel">Deploys everything in the workspace</span>
				    						</span>
				    					</a>
				    				</li>
				    				<li>
				    					<a id="deploymenu-item-flow" href="#">
				    						<i className="fa fa-square pull-left"></i>
				    						<i className="fa fa-check-square pull-left"></i>
				    						<img src="images/deploy-flows.png"/> 
				    						<span className="menu-label-container">
				    							<span className="menu-label">Modified Flows</span>
				    							<span className="menu-sublabel">Only deploys flows that contain changed nodes</span>
				    						</span>
				    					</a>
				    				</li>
				    				<li>
				    					<a id="deploymenu-item-node" href="#">
				    						<i className="fa fa-square pull-left"></i>
				    						<i className="fa fa-check-square pull-left"></i>
				    						<img src="images/deploy-nodes.png"/> 
				    						<span className="menu-label-container">
				    							<span className="menu-label">Modified Nodes</span>
				    							<span className="menu-sublabel">Only deploys nodes that have changed</span>
				    						</span>
				    					</a>
				    				</li>
				    			</ul>
				    		</span>
				        </li>
				        <li>
				        	<a id="btn-sidemenu" className="button" data-toggle="dropdown" href="#">
				        		<i className="fa fa-bars"></i>
				        	</a>
				        </li>
				    </ul>
				</div>
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
