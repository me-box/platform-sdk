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

export default class Circle extends Component {

  	constructor(props){
  		super(props);	
  		this._onRotate = this._onRotate.bind(this);
  		this._onExpand = this._onExpand.bind(this);
  		this._onMouseDown = this._onMouseDown.bind(this);
  		this._templateSelected = this._templateSelected.bind(this);
  	}

 
  	renderControls(r){
  			
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
  					<circle style={rotatestyle}  cx={0} cy={-r-40} r={6} onMouseDown={this._onRotate}/>
  					<line style={linestyle} x1={0} x2={0} y1={-r-40+6} y2={-r}/>
  					<circle style={style} cx={-r} cy={-r} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={r} cy={r} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={r} cy={-r} r={6} onMouseDown={this._onExpand}/> 
  					<circle style={style} cx={-r} cy={r} r={6} onMouseDown={this._onExpand}/>
  				</g>
  	}

 	shouldComponentUpdate(nextProps, nextState){
 		

        return this.props.template != nextProps.template || this.props.selected != nextProps.selected;
    }

	render(){
		
		const {id, template, selected}  = this.props;
		console.log(`CIRCLE  ${id} in render`);

		const {cx,cy,r,style,transform="translate(0,0)"} = template;
		const amSelected = selected.indexOf(id) != -1;
		
		const _style = camelise(style);

		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}

		const sw = _style.strokeWidth ? Number(sw) ? Number(sw) : 0 : 0;
	
		const selectedr = Number(r)+2+sw/2;


		return 	<g transform={`translate(${cx},${cy}) ${transform}`}>
			 		<circle cx={0} cy={0} r={r} style={_style} onClick={this._templateSelected} onMouseDown={this._onMouseDown}></circle>
			 		{amSelected && <circle cx={0} cy={0} r={selectedr} style={_selectedstyle}></circle>}
			 		{amSelected && this.renderControls(selectedr)}
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
		this.props.actions.onExpand(nid,id);
	}

}

