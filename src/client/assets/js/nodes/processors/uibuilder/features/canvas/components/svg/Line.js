import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {camelise} from 'nodes/processors/uibuilder/utils';
import { actionCreators as canvasActions, selector } from '../..';
import { connect } from 'react-redux';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(canvasActions, dispatch)
  }
})
export default class Line extends Component {

	shouldComponentUpdate(nextProps, nextState){
        return this.props.template != nextProps.template || this.props.selected != nextProps.selected;
    }

	render(){
		
		const {id, template} = this.props;
		const {x1,x2,y1,y2,style} = template;
		const _style = camelise(style);

		return <line x1={x1} x2={x2} y1={y1} y2={y2} style={_style}/>
	}
}