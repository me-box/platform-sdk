import React, { Component, PropTypes } from 'react';
import {testAction} from './BNodeActions';
import {bnodereducer} from './bnodereducer';

class BNode extends Component {
	
	
	constructor(props){
		super(props);
		this.doSomething = this.doSomething.bind(this);
	}

	componentDidMount(){
		this.props.register("bnodereducer", bnodereducer);
	}

	doSomething(){
		this.props.dispatch(testAction("my test action!!"));
	}

	render() {

		return( 
			 <div>
			 	<h1 onClick={this.doSomething}> Hello {this.props.data}</h1>
			 </div>
		);
	}
}

BNode.propTypes = { 
		register: React.PropTypes.func, 
		dispatch: React.PropTypes.func
};

export default BNode;