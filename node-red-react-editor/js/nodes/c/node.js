import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {reducer} from './reducer';
import * as Actions from './actions';
import composeNode from '../../utils/composeNode';

class Node extends Component {
	
	constructor(props){
		super(props);
		Object.assign(this, ...bindActionCreators(Actions, props.dispatch));
	}

	componentWillMount(){
		this.props.register("sentiment", reducer);
	}

	render() {	
		return <form id="dialog-form" className="form-horizontal"></form> 			
	}
}

export default composeNode(

	Node, 
	
	'sentiment',{
        category: 'analysis-function',
        color:"#E6E0F8",
        defaults: {
            name: {value:""},
        },
        inputs:1,
        outputs:1,
        icon: "arrow-in.png",
        label: function() {
            return this.name||"sentiment";
        },
        labelStyle: function() {
            return this.name?"node_label_italic":"";
        }
    }
);