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

export default class Text extends Component {

	static defaultProps = {
   		transform: "translate(0,0)"
  	};

  	
  	constructor(props){
  		super(props);	
  		this._onRotate = this._onRotate.bind(this);
  		this._onExpand = this._onExpand.bind(this);
  		this._onMouseDown = this._onMouseDown.bind(this);
  		this._templateSelected = this._templateSelected.bind(this);
  	}

	render(){
		const {id, template, selected} = this.props;
		const {x,y,text,style} = template;

		const _style = camelise(style);

		return 	<g transform={this.props.transform}>
			 		<text textAnchor="middle" x={x} y={y} style={_style} onClick={this._onSelect} onMouseDown={this._onMouseDown}>{text}</text>
			 	</g>
	}

	_templateSelected(){
		const {id, template} = this.props;
		this.props.actions.templateSelected({path:[id], type:template.type});
	}

	_onMouseDown(){
		const {id, template} = this.props;
		this.props.actions.onMouseDown({path:[id], type:template.type});
	}

	_onRotate(){
		this.props.actions.onRotate(this.props.id);
	}

	_onExpand(){
		this.props.actions.onExpand(this.props.id);
	}
}