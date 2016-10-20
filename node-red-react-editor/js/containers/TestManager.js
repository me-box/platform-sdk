import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {init} from '../comms/websocket';

class TestManager extends Component {
	
	constructor(props){
		super(props);
	} 
	
	componentDidMount(){
		const {dispatch, id} = this.props;
		init("databox",id, dispatch);
	}

	render() {
		return <h1>test manager </h1>
	}
	
};

function select(state) {
  return {
     apps: state.apps.data,
     id: state.publisher.app.id,
  }
}

export default connect(select)(TestManager);
