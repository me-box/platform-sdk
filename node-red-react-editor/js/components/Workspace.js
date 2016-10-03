import React from 'react';
import Chart from './Chart';


import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH} from '../constants/ViewConstants';
import cx from 'classnames';

class Workspace extends React.Component {
	
	constructor(props){
        super(props);
        this._updateTab = this._updateTab.bind(this);
        this._deleteTab = this._deleteTab.bind(this);
    }
	
	render() {
		
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
			padding: 'none',
			height: 30,	
		}
		
		const tabs = this.props.tabs.map((item,i)=>{
						const selected =  this.props.currentTab ? item.id === this.props.currentTab.id : false;
						
						const className = cx({
							'red-ui-tab': true,
							'active' : selected,
						});
						
						let tabcontent;
						
						if (selected){
						
						 	const inputprops = {
								value: this.props.currentTab ? this.props.currentTab.label : "",
								onClick: this.props.selectTab.bind(this, item),
								onChange: this._updateTab.bind(this,item.id),
							}
							
							tabcontent =  <div>
											<div>
												<input type="text" {...inputprops} style={tabtextstyle}></input>
										  	</div>
										  	<div style={{position: 'absolute', top: 0, right: 5}}>
										  		<i className="fa fa-times fa-fw" onClick={this._deleteTab.bind(this,item.id)} />
										  	</div>
										  </div>
							
						}
						else{
							tabcontent = <a className="red-ui-tab-label" onClick={this.props.selectTab.bind(this, item)}>
											<span>{item.label}</span>
										 </a>
						
						}
						
						return <li key={i} className={className} style={style}> 
									{tabcontent}
							   </li>
				
					});
		
		
		 
          
		return( <div style={workspace}>
					<ul id="workspace-tabs" className="red-ui-tabs">
						{tabs}
					</ul>
		    		<div id="workspace-add-tab" style={addTabStyle}>
		    			<a id="btn-workspace-add-tab" onClick={this.props.addTab}>
		    				<i className="fa fa-plus"></i>
		    			</a>
		    		</div>
		    		
		    		<Chart {...this.props}/>
		    		
		    		
					
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
		this.props.deleteTab(id, event.target.value);
	}
	
	_updateTab(id, event){
		this.props.updateTab(id, event.target.value);
	}
}

export default Workspace;