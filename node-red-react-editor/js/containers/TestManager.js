import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import MobilePhone from '../components/MobilePhone';
import List from '../components/List';
import init from '../comms/websocket';

class TestManager extends Component {
	
	constructor(props){
		super(props);
		//Object.assign(this, ...bindActionCreators(RepoActions, props.dispatch));
	} 
	
	componentDidMount(){
		const {dispatch} = this.props;
		init("databox","testApp", dispatch);
		//init websocket here!
	}

	render() {
		const {apps, dispatch} = this.props;
		
		
		const applist = apps.map((app,i)=>{
	    	
	    	let dataview;

	    	switch (app.view){	    		
	    		case 'list':
	    			
	    			const data = app.data[app.data.length-1];
	    			const props = {title: app.name, keys: data.keys, rows: data.rows};
					dataview = <List {...props}/>
	    			break;
	    	
	    	}

	    	const {view} =  app;

	    	const classname = cx({
	    		[view]:true,
	    	})	

	    	return <div>	
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
