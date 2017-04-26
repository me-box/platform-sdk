import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {camelise,componentsFromTransform} from 'nodes/processors/uibuilder/utils';
import { actionCreators as canvasActions, selector, NAME } from '../..';
import { connect } from 'react-redux';
import {Circle, Text, Line, Rect, Ellipse,Path} from "./"

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(canvasActions, dispatch)
  }
})

export default class Group extends Component {
	
  	constructor(props){
  		super(props);	
  		this._onRotate = this._onRotate.bind(this);
  		this._onExpand = this._onExpand.bind(this);
  		this._onMouseDown = this._onMouseDown.bind(this);
  		this._templateSelected = this._templateSelected.bind(this);
  	}


	renderChildren(children){

		const {[NAME]:{templatesById}} = this.props;

		return children.map((id)=>{

			const type = templatesById[id].type;
			
			switch(type){
				
				case "circle":
					return <Circle key={id} id={id}/>
			 	
			 	case "ellipse":
					return <Ellipse key={id} id={id}/>

				case "rect":
					return <Rect key={id}  id={id}/>

				case "text":
					return <Text key={id} id={id}/>

				case "line":
					return <Line key={id} id={id}/>

			 	case "path":
					return <Path key={id} id={id}/>

				case "group":
					return <Group key={id} {...{...this.props, ...{id}}}/>
							
				default:
					return null;
			}
		});
	}

	renderControls(x,y, width, height){
  		
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
  					<circle style={rotatestyle}  cx={x+width/2} cy={y-40} r={6} onMouseDown={this._onRotate}/>
  					<line style={linestyle} x1={x+width/2} x2={x+width/2} y1={y-40+6} y2={y}/>
  					<circle style={style} cx={x+width+10} cy={y+height+10} r={10} onMouseDown={this._onExpand}/>
  				</g>
  	}

	render(){

		const {id, selected, [NAME]:{templatesById}} = this.props;
		const template = templatesById[id];
		const amSelected = selected.indexOf(id) != -1;
		const {x,y,width,height,style,transform="translate(0,0)"} = template;
		const _style = camelise(style);
		
		const {scale=1,rotate,translate} = componentsFromTransform(transform.replace(/\s+/g,""));
		const [degrees,rx,ry] = rotate || [0,0,0];
		const [tx=0,ty=0] = translate || [0,0];

		const dtx = (Number(x)/Number(scale))+Number(tx);
		const dty = (Number(y)/Number(scale))+Number(ty);

		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}

		const _transform = `scale(${scale}),translate(${dtx},${dty}),rotate(${degrees},${Number(rx)},${Number(ry)})`; 
		
		return <g style={_style} transform={_transform} onMouseDown={this._onMouseDown} onClick={this._templateSelected}>
				    {amSelected && this.renderControls(0, 0, width, height)}
					{this.renderChildren(template.children)}
				    {amSelected && <rect x={0} y={0} width={width} height={height} style={_selectedstyle} />}
			 	</g>


	}

	_templateSelected(){
		const {nid, id, template} = this.props;
		this.props.actions.templateSelected(nid,{path:[id], type:template.type});
	}

	_onMouseDown(){
		const {nid, id, template} = this.props;
		this.props.actions.onMouseDown(nid,{path:[id], type:template.type});
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