import React from 'react';
import NodeCanvas from 'features/nodes/components/NodeCanvas';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH} from 'constants/ViewConstants';
import cx from 'classnames';
import { actionCreators as workspaceActions, selector } from '../';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(workspaceActions, dispatch),
  }
})
export default class Workspace extends React.Component {
	
	constructor(props){
        super(props);
        this._updateTabName = this._updateTabName.bind(this);
        this._deleteTab = this._deleteTab.bind(this);
    }

    componentDidMount(){
    	 this.props.actions.addTab();
    }
	
	render() {
	
		const {workspace:{currentId, tabs, tabsById}} = this.props;

		const style={
			width: '48.0676%',
		}
	
		const workspace ={
			position: 'absolute',
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`
		}
	
		const addTabStyle={
			right: this.props.sidebarExpanded ? SIDEBAR_WIDTH : 0,
		}
		
		//<span>{item.label}</span>
		//className="red-ui-tab-label" 
		
		const tabtextstyle={
			border: 'none',
			paddingLeft: 7,
			height: 30,	
		}
		
		const _tabs = tabs.map((tabId,i)=>{

			const selected =  currentId === tabId;
			const tab = tabsById[tabId];
			

			const className = cx({
				'red-ui-tab': true,
				'active' : selected,
			});
			
			let tabcontent;
			
			if (selected){
			
			 	const inputprops = {
					value: selected ? tab.name : "",
					onClick: this.props.actions.selectTab.bind(this, tab.id),
					onChange: this._updateTabName.bind(this,tab.id),
				}
				
				tabcontent =  <div>
								<div>
									<input type="text" {...inputprops} style={tabtextstyle}></input>
							  	</div>
							  	<div style={{position: 'absolute', top: 5, right: 5}}>
							  		<i className="fa fa-times fa-fw" onClick={this._deleteTab.bind(this,tab.id)} />
							  	</div>
							  </div>
				
			}
			else{
				tabcontent = <a className="red-ui-tab-label" onClick={this.props.actions.selectTab.bind(this, tab.id)}>
								<span>{tab.name}</span>
							 </a>
			
			}
			
			return <li key={i} className={className} style={style}> 
						{tabcontent}
				   </li>
	
		});
		
		
		 
          
	/*
		    		<NodeCanvas {...this.props}/>*/


		return ( <div style={workspace}>
					<ul id="workspace-tabs" className="red-ui-tabs">
						{_tabs}
					</ul>
		    		<div id="workspace-add-tab" style={addTabStyle}>
		    			<a id="btn-workspace-add-tab" onClick={this.props.actions.addTab}>
		    				<i className="fa fa-plus"></i>
		    			</a>
		    		</div>
		    		
		    		<NodeCanvas {...this.props}/>

		    		<div id="workspace-toolbar"></div>
		    		<div id="workspace-footer">
			            <a className="workspace-footer-button" id="btn-zoom-out" href="#">
			            	<i className="fa fa-minus"></i>
			            </a>
			            <a className="workspace-footer-button" id="btn-zoom-zero" href="#">
			            	<i className="fa fa-circle-o"></i>
			            </a>
			            <a className="workspace-footer-button" id="btn-zoom-in" href="#">
			            	<i className="fa fa-plus"></i>
			            </a>
			        </div>
			    </div>
		);
	}
	
	
	_deleteTab(id, event){
		this.props.actions.deleteTab(id);
	}
	
	_updateTabName(id, event){
		this.props.actions.updatePackageName(id, event.target.value);
	}
}