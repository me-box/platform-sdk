import React, { Component, PropTypes } from 'react';
import {reducer} from './reducer';
import { bindActionCreators } from 'redux';
import * as Actions from './actions';
import * as RegisterActions from '../../actions/RegisterActions';

class BNode extends Component {
	
	constructor(props){
		super(props);
		Object.assign(this, ...bindActionCreators(Actions, props.dispatch), ...bindActionCreators(RegisterActions, props.dispatch));
	}

	componentWillMount(){
		this.props.register("bnodereducer", reducer);
	}

	componentDidMount(){
		this.registerType('sample',	
							{	
						        category: 'input',      // the palette category
						        color: '#a6bbcf',
						        defaults: {             // defines the editable properties of the node
						            name: {value:""},   //  along with default values.
						            topic: {value:"", required:true}
						        },
						        inputs:1,               // set the number of inputs - only 0 or 1
						        outputs:1,              // set the number of outputs - 0 to n
						        // set the icon (held in icons dir below where you save the node)
						        icon: "myicon.png",     // saved in  icons/myicon.png
						        label: function() {     // sets the default label contents
						            return this.name||this.topic||"sample";
						        },
						        labelStyle: function() { // sets the class to apply to the label
						            return this.name?"node_label_italic":"";
						        }
						    }
						);
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