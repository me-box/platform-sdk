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

export default class Path extends Component {

	shouldComponentUpdate(nextProps, nextState){
        return this.props.template != nextProps.template || this.props.selected != nextProps.selected;
    }

	render(){
		
		const {id,template,selected} = this.props;
		const {d,style} = template;
		const amSelected = selected.indexOf(id) !== -1;

		let _style = camelise(style);

		if (amSelected){
			_style = {
				..._style,
				stroke:"#3f51b5",
				strokeWidth:2,
				fill:"#3f51b5",
				fillOpacity: 0.8,
			}
		}
		return <path d={d} style={_style} />
	}
}