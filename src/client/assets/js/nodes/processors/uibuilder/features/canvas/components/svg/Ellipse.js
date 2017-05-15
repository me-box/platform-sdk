import React, { Component } from 'react';
import {camelise} from 'nodes/processors/uibuilder/utils';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector } from '../..';
import { connect } from 'react-redux';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(canvasActions, dispatch)
  }
})

export default class Ellipse extends Component {

  	constructor(props){
  		super(props);	
  		this._onRotate = this._onRotate.bind(this);
  		this._onExpand = this._onExpand.bind(this);
  		this._onMouseDown = this._onMouseDown.bind(this);
  		this._templateSelected = this._templateSelected.bind(this);
  	}

  	shouldComponentUpdate(nextProps, nextState){
        return this.props.template != nextProps.template || this.props.selected != nextProps.selected;
    }

  	renderControls(rx, ry){
  		
  		const style = {
			stroke: "black",
			strokeWidth: 1,
			fill: '#3f51b5',
		}

		const rotatestyle = {
			stroke: "black",
			strokeWidth: 1,
			fill: 'red',
		}

		const linestyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
		}
  					
  		return 	<g>
  					<circle style={rotatestyle}  cx={0} cy={-ry-40} r={6} onMouseDown={this._onRotate}/>
  					<line style={linestyle} x1={0} x2={0} y1={-ry-40+6} y2={-ry}/>
  					<circle style={style} cx={-rx} cy={-ry} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={rx} cy={+ry} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={rx} cy={-ry} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={-rx} cy={ry} r={6} onMouseDown={this._onExpand}/>
  				</g>
  	}

	render(){
		console.log("ELLIPSE in render");
		const {id, template, selected}  = this.props;
		const {cx,cy,rx,ry,r,style,transform="translate(0,0)"} = template;
		const _style = camelise(style);
		const amSelected = selected.indexOf(id) != -1;

		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const sw = _style.strokeWidth ? Number(sw) ? Number(sw) : 0 : 0;

		const selectedrx = Number(rx)+2+sw/2;
		const selectedry = Number(ry)+2+sw/2;
		
		return 	<g transform={`translate(${cx},${cy}) ${transform}`}>
			 		<ellipse cx={0} cy={0} rx={rx} ry={ry} style={_style} onClick={this._templateSelected} onMouseDown={this._onMouseDown}/>
			 		{amSelected && this.renderControls(selectedrx, selectedry)}
			 	</g>

	}

	_templateSelected(){
		const {nid, id, template} = this.props;
		this.props.actions.templateSelected(nid, {path:[id], type:template.type});
	}

	_onMouseDown(){
		const {nid, id, template} = this.props;
		this.props.actions.onMouseDown(nid, {path:[id], type:template.type});
	}

	_onRotate(){
		const {nid, id} = this.props;
		this.props.actions.onRotate(nid,id);
	}

	_onExpand(){
		const {nid, id} = this.props;
		this.props.actions.onExpand(nid, id);
	}

}