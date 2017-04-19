import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {camelise} from 'nodes/outputs/uibuilder/utils';
import { actionCreators as canvasActions, selector } from '../..';
import { connect } from 'react-redux';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(canvasActions, dispatch)
  }
})

export default class Path extends Component {


	render(){
		const {id,template,selected} = this.props;
		const {d,style} = template;
		const amSelected = selected.indexOf(id) != -1;

		const _style = camelise(style);

		if (amSelected){
			_style.stroke = "#3f51b5";
			_style.strokeWidth = 2;
		}
		return <path d={d} style={_style} />
	}
}