import React, { Component } from 'react';
import { actionCreators as helpActions, selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {PALETTE_WIDTH} from 'constants/ViewConstants';
import './help.css';
import cx from 'classnames';
import Schema from '../Schema';


@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(helpActions, dispatch),
  }
})

export default class Help extends Component {

	state = {
		category: "description",
		dragging: false,
		currentY: 0,
		currentHeight: 300,
	}	

	constructor(props){
		super(props);
		this.renderMenu = this.renderMenu.bind(this);
		this.renderContent = this.renderContent.bind(this);
		this.renderMenuItem = this.renderMenuItem.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onExit = this.onExit.bind(this);
		this.startDrag = this.startDrag.bind(this);
		//this.state = {category:"description"};
	}

	
	renderMenuItem(item){
		
		const onClick = ()=>this.setState({category:item});

		if (this.state.category === item){
			return <li onClick={onClick} className="selected">{item}</li>
		}
		return <li onClick={onClick}>{item}</li>
	}

	renderMenu(){
		const {node} = this.props;
		const {type="", inputs=0, outputs=0} = node || {};

		return <ul className="menu">
					<li className="name">{type}</li>
					{this.renderMenuItem("description")}
					{inputs > 0 && this.renderMenuItem("expected input")}
					{outputs >0 && this.renderMenuItem("output data")}
			   </ul>

	}

	renderDescription(description){
		return <div dangerouslySetInnerHTML={{__html:description}}/> 
	}

	renderInputs(node){
		if (!node)
			return null;

		const props = {
				schema: node.schema ? node.schema.input || {} : {}, 
				id: node.id,
				selectedid: node.id,
		};

		return <Schema {...props}/> 	
	}

	renderOutputs(node){
		if (!node)
			return null;
		
		const props = {
			schema: node.schema ? node.schema.output || {} : {}, 
			id: node.id,
			selectedid: node.id,
		};
		
		return <Schema {...props}/> 	
	}

	renderContent(){
		const {node={}} = this.props;
		
		let description = "";

		if (node){
			if (node._def.descriptionfn){
				description = node._def.descriptionfn(node.subtype);
			}else{
				description = node.description;
			}
		}

		switch (this.state.category){
			case "description":
				return this.renderDescription(description);
			case "expected input":
				return this.renderInputs(node)
			case "output data":
				return this.renderOutputs(node)
			default:
				return this.renderDescription(description);
		}
	}

	startDrag(e){
	
		const {clientY} = e;
		e.stopPropagation();
		this.setState({dragging:true, currentY:clientY})
	}

	onDrop(e){

		e.stopPropagation();
		this.setState({dragging:false})
	}

	onExit(e){
		console.log("MOUSE EXITED!!");
	}

	onDrag(e){
		
		e.stopPropagation();
		const {clientY} = e;
		if (this.state.dragging){
			this.setState({currentHeight: this.state.currentHeight + (this.state.currentY-clientY)});
			this.setState({currentY : clientY});

		}
		
	}

	render(){

		const {visible, w, h, node} = this.props;
		const {y=0} = node || {};
		

		const style ={
			left: PALETTE_WIDTH,
			width: w-PALETTE_WIDTH,
			height: Math.min(this.state.currentHeight, h-y-25)
		}
		const className = cx({
			closed: !visible
		});

		
		

		return 		<div>
						<div className="inner">
							<div draggable="true" 
							onMouseDown={this.startDrag}
							onMouseUp={this.onDrop} 
							onMouseLeave={this.onDrop}
							onMouseMove={this.onDrag}
							style={style} 
							id="help" 
							className={className}>
							
								{this.renderMenu()}
								<div className="content">{this.renderContent()}</div>
							</div>
						</div>
					</div>

			
	}
}