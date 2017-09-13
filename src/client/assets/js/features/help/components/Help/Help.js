import React, { Component } from 'react';
import { actionCreators as helpActions, selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Drawer from 'react-md/lib/Drawers';
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
	
	constructor(props){
		super(props);
		this.renderMenu = this.renderMenu.bind(this);
		this.renderContent = this.renderContent.bind(this);
		this.renderMenuItem = this.renderMenuItem.bind(this);
		this.state = {category:"description"};
	}


	componentDidMount(){
		this.state = {category:"description"};
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
		const {description=""} = node || {};

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

	render(){
		const {visible, w} = this.props;
		const style ={
			left: PALETTE_WIDTH,
			width: w-PALETTE_WIDTH,
			visible: visible,
		}
		const className = cx({
			closed: !visible
		});



		return 	<div style={style} id="help" className={className}>
					{this.renderMenu()}
					<div className="content">
						{this.renderContent()}
					</div>
				</div>
	}
}