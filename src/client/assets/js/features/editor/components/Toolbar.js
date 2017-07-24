import React, {Component} from 'react';
import { connect } from 'react-redux';
//import * as ToolbarActions from '../actions/ToolbarActions';
//import {toggleSaveDialogue} from '../actions/RepoActions';
//import config from '../config';
import MDToolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';

export default class Toolbar extends Component {

  constructor(props){
  	super(props);
  } 

  render() {
  	
  		const actions = [
  			<Button flat label="liveload" onClick={this.props.requestCode}/>,
  			<Button flat label="logout" href="/auth/logout"/>,
  			<Button flat label="load" onClick={this.props.requestRepos}/>,
  			<Button flat label="save" onClick={this.props.toggleSaveDialogue}/>,
  			<Button flat label="test" onClick={this.props.test}/>,
  			<Button flat label="publish" onClick={this.props.togglePublisher}/>
  		]
  		
  		return <MDToolbar
            colored
         	actions={actions}
            title="databox SDK"
            style={{width:"100%", position:"fixed"}}
          />
  }


  /*  const { dispatch, expanded, showSaveDialogue} = this.props;
    
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

	const toolbarstyle={
		paddingTop: 4,
	}
	    
   
        
    return (	
    		<div>
				<div id="header">
					<span className="logo" style={logoStyle}>
						<a href="#"><span>databox app SDK</span></a>
					</span>
					<ul className="header-toolbar" style={toolbarstyle}>
					  <li>
						 <a style={buttonstyle} href="/auth/logout">logout</a>
					  </li>
					   <li>
						 <a style={buttonstyle} onClick={this.toggleAppManager}>load</a>
					  </li>
					   <li>
						 <a style={buttonstyle} onClick={this.toggleSaveDialogue}>save</a>
					  </li>
					  <li>
						 <a style={buttonstyle} onClick={this.togglePublisher}>publish</a>
					  </li>
					  <li>
						<span className="deploy-button-group button-group">
						  <a id="btn-deploy" className="deploy-button" onClick={this.deploy}>
						  <img id="btn-deploy-icon" src="images/deploy-full-o.png"/> 
						  <span>Test</span>
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
						
					</ul>
				</div>
			</div>
        
        );
    
  } */
}


/*function select(state) {
  return {
    expanded: state.editor.deploymenuexpanded,
  };
}

export default connect(select)(Toolbar)*/