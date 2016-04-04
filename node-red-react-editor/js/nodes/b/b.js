import React, { Component, PropTypes } from 'react';
import {bnodereducer} from './bnodereducer';
import { bindActionCreators } from 'redux';
import * as BNodeActions from './BNodeActions';

class BNode extends Component {
	
	constructor(props){
		super(props);
		Object.assign(this, ...bindActionCreators(BNodeActions, props.dispatch));
	}

	componentDidMount(){
		this.props.register("bnodereducer", bnodereducer);
	}

	render() {

		return( 
			 <div>
			 	<h1 onClick={this.testAction.bind(this, "")}> Hello {this.props.data}</h1>
			 </div>
		);
	}
}

BNode.propTypes = { 
	register: React.PropTypes.func, 
	dispatch: React.PropTypes.func
};

export default BNode;