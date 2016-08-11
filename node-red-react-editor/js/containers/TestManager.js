import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import MobilePhone from '../components/app/MobilePhone';
import List from '../components/app/List';
import Chart from '../components/app/Chart';
import {init} from '../comms/websocket';
import {MOBILE_TEST_SCREEN_WIDTH, MOBILE_TEST_SCREEN_HEIGHT} from '../constants/ViewConstants';
import {MAXREADINGS} from '../constants/ChartConstants';

class TestManager extends Component {
	
	constructor(props){
		super(props);
	} 
	
	componentDidMount(){
		const {dispatch, id} = this.props;
		init("databox",id, dispatch);
	}

	render() {
		const {apps, dispatch} = this.props;
		
		
		const applist = apps.map((app,i)=>{
	    	
	    	let dataview;
			const data = app.data;
			
	    	switch (app.view){	
	    	
	    		case 'chart':
	    			
	    			let [config, ...values] = data;
	    			
	    			dataview = <Chart {...{title: app.name, w: MOBILE_TEST_SCREEN_WIDTH, h:MOBILE_TEST_SCREEN_HEIGHT, config: config, data: values.slice(-MAXREADINGS)}} />
	    			break;
	    			
	    		case 'text':
	    			dataview = data || "";
	    			break;
	    			    		
	    		case 'list':
	    			
	    			if (data === Object(data)){ //if this is a valid javascript object
					
						data.keys = data.keys || [];
						data.rows = data.rows || [];
						dataview = <List key={i} {...{title: app.name, keys: data.keys, rows: data.rows}}/>
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
     id: state.publisher.app.id,
  }
}

export default connect(select)(TestManager);
