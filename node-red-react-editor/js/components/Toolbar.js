import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as ToolbarActions from '../actions/ToolbarActions';
import { bindActionCreators } from 'redux';


class Toolbar extends Component {

  constructor(props){
  	super(props);
    Object.assign(this, ...bindActionCreators(ToolbarActions, props.dispatch));
  } 

  render() {
    const { dispatch, expanded } = this.props;
    
    const style={
      display: expanded ? 'block' : 'none',
    }

    const logoStyle ={
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      margin:0, 
      color:'white'
    }

    const buttonstyle = {
      background: '#8C101C',
      color: '#eee',
      paddingTop: 6,
      paddingBottom: 8,
      paddingRight: 8,
      paddingLeft: 8,
      marginLeft: '14',

    }

    return (
				<div id="header">
					<span className="logo" style={logoStyle}>
						<a href="#"><span>databox app SDK</span></a>
					</span>
					<ul className="header-toolbar">
					  <li>
						 <a style={buttonstyle} onClick={this.publish}>publish</a>
					  </li>
					  <li>
						 <a style={buttonstyle} onClick={this.toggleAppManager}>app manager</a>
					  </li>
					  <li>
						<span className="deploy-button-group button-group">
						  <a id="btn-deploy" className="deploy-button" onClick={this.deploy}>
						  <img id="btn-deploy-icon" src="images/deploy-full-o.png"/> 
						  <span>Deploy</span>
						  </a>
						  <a id="btn-deploy-options" data-toggle="dropdown" className="deploy-button" onClick={this.toggleDeployMenu}>
							<i className="fa fa-caret-down"></i>
						  </a>
						  <ul id="btn-deploy-options-submenu" className="dropdown-menu pull-right" style={style}>
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
        
        );
    
  }
}

function select(state) {
  return {
    expanded: state.editor.deploymenuexpanded,
  };
}

export default connect(select)(Toolbar)