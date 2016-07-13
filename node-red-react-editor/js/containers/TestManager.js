import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import MobilePhone from '../components/MobilePhone';
import List from '../components/List';
import {init} from '../comms/websocket';

class TestManager extends Component {
	
	constructor(props){
		super(props);
	} 
	
	componentDidMount(){
		const {dispatch} = this.props;
		init("databox","testApp", dispatch);
	}

	render() {
		const {apps, dispatch} = this.props;
		
		
		const applist = apps.map((app,i)=>{
	    	
	    	let dataview;
			const data = app.data;
			
	    	switch (app.view){	
	    	
	    		case 'text':
	    			dataview = data || "";
	    			break;
	    			    		
	    		case 'list':
	    			
	    			if (data === Object(data)){ //if this is a valid javascript object
					
						data.keys = data.keys || [];
						data.rows = data.rows || [];
					    console.log("rows are");
					    console.log(rows);
						const props = {title: app.name, keys: data.keys, rows: data.rows}
						dataview = <List {...props}/>
					}
	    			break;
	    	
	    	}

	    	const {view} =  app;

	    	const classname = cx({
	    		[view]:true,
	    	})	

	    	return <div key={i}>	
						<div>
							<div key={i} className={classname}>
								{dataview}
							</div>		
					   </div>
	    		   </div>
	    });
		
		
		return <MobilePhone content={applist}/>
	}
	
};

function select(state) {
  return {
     apps: state.apps,
  }
}

export default connect(select)(TestManager);
