import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import {reducer} from './reducer';
import * as Actions from './actions';
import composeNode from '../../utils/composeNode';

class SampleNode extends Component {
	
	constructor(props){
		super(props);
		console.log("ok amd in constructor and props are");
		console.log(props);

		Object.assign(this, ...bindActionCreators(Actions, props.dispatch));
	}

	componentWillMount(){
		this.props.register("sample", reducer);
	}

	//<Component  {...componentprops}/>
	render() {	
		return <h1> I am an input node! </h1> 			
	}
}

export default composeNode(

	SampleNode, 
	
	'sample',
	
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
	    icon: "debug.png",     // saved in  icons/myicon.png
	    label: function() {     // sets the default label contents
	        return this.name||this.topic||"sample";
	    },
	    labelStyle: function() { // sets the class to apply to the label
	        return this.name?"node_label_italic":"";
	    }
	}
);