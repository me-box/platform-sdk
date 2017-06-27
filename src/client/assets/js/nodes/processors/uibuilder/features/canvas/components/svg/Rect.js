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
export default class Rect extends Component {

  	constructor(props){
  		super(props);	
  		this._onRotate = this._onRotate.bind(this);
  		this._onExpand = this._onExpand.bind(this);
  		this._onMouseDown = this._onMouseDown.bind(this);
  		this._templateSelected = this._templateSelected.bind(this);
  	}


  	renderControls(width, height){

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
  					<circle style={rotatestyle}  cx={width/2} cy={-40} r={6} onMouseDown={this._onRotate}/>
  					<line style={linestyle} x1={width/2} x2={width/2} y1={6-40} y2={0}/>
  					<circle style={style} cx={0} cy={0} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={0} cy={height} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={width} cy={0} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={width} cy={height} r={6} onMouseDown={this._onExpand}/>
  				</g>
  	}

  	shouldComponentUpdate(nextProps, nextState){
        return this.props.template != nextProps.template || this.props.selected != nextProps.selected;
    }

	render(){
	
		const {id, template, selected} = this.props;
		const {x,y,rx,ry,width,height,style,transform="translate(0,0)"} = template;
		const _style = camelise(style);
		const amSelected = selected.indexOf(id) != -1;
		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const sw = _style.strokeWidth ? Number(sw) ? Number(sw) : 0 : 0;

		const selectedw = (Number(width)+4+sw/2);
		const selectedh = (Number(height)+4+sw/2);

		return 	<g transform={`translate(${x},${y}) ${transform}`}>
			 		<rect rx={rx} ry={ry} x={0} y={0} width={width} height={height} style={_style} onClick={this._templateSelected} onMouseDown={this._onMouseDown}/>
			 		{amSelected && <rect rx={rx} ry={ry} x={-2} y={-2} width={selectedw} height={selectedh} style={_selectedstyle} />}
			 		{amSelected && this.renderControls(selectedw, selectedh)}
			 	</g>

	}

	_templateSelected(){
		const {nid,id, template} = this.props;
		this.props.actions.templateSelected(nid,{path:[id], type:template.type});
	}

	_onMouseDown(){
		const {nid,id, template} = this.props;
		this.props.actions.onMouseDown(nid,{path:[id], type:template.type});
	}

	_onRotate(){
		const {nid,id} = this.props;
		this.props.actions.onRotate(nid,id);
	}

	_onExpand(){
		const {nid,id} = this.props;
		this.props.actions.onExpand(nid,id);
	}

}