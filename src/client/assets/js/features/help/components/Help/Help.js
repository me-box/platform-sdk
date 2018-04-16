import React, { Component } from 'react';
import { actionCreators as helpActions, selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {PALETTE_WIDTH} from 'constants/ViewConstants';
import './help.css';
import cx from 'classnames';
import Schema from '../Schema';


const _colours = {
    "identifier": "#3771c8",
    "personal" : "#E65100",
    "sensitive" : "#B71C1C",
}

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(helpActions, dispatch),
  }
})

export default class Help extends Component {

	state = {
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
	}

	
	renderMenuItem(item){
		
		const onClick = (i)=>this.props.actions.setSubtype(i);

		if (this.props.subtype === item){
			return <li onClick={()=>onClick(item)} className="selected">{item}</li>
		}
		return <li onClick={()=>onClick(item)}>{item}</li>
	}

	renderMenu(){
		const {node} = this.props;
		const {type="", inputs=0, outputs=0} = node || {};

		return <ul className="menu">
					<li className="name">{type}</li>
					{this.renderMenuItem("description")}
					{inputs > 0 && this.renderMenuItem("expected input")}
					{outputs >0 && this.renderMenuItem("output data")}
					{outputs > 0 && this.renderMenuItem("personal data")}
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

	renderEvidence(ptype){
		if (ptype.evidence){
			return 	<div className="noborder">
						<div className="personalcontent"><a href="{ptype.evidence}">{ptype.evidence}</a></div>
					</div>
		}
		return null;
	}

	renderTitle(ptype, property, value){
		if (ptype[property]){
			return 	<div className="noborder">
						<div className="personaltitle">{value}</div>
					</div>
		}
		return null;
	}

	renderGranularityConditions(item){
		if (item.accuracy){
			console.log(item);
			return <li>This inference can be made with a {item.accuracy * 100}% accuracy if the source granularity has a threshold of {item.granularity.threshold} {item.granularity.unit}</li>
		}
		return <li>This inference can be made if the source granularity has a threshold of {item.granularity.threshold} {item.granularity.unit}</li>
	}

	renderAttributeConditions(item){
		if (item.accuracy){
			return <li>This inference can be made with a {item.accuracy * 100}% accuracy if the following data is also present: {item.attributes.join()}</li>
		}
		return  <li>This inference can be made if the following data is also present: {item.attributes.join()}</li>
	}

	renderConditions(ptype){
		if (ptype.conditions){

			const conditions = ptype.conditions.map((item)=>{
				if (item.granularity){
					return this.renderGranularityConditions(item);
				}
				if (item.attributes){
					return this.renderAttributeConditions(item);
				}
			});
			return 	<div className="noborder">
						<div  className="personalcontent">
							<ul>
								{conditions}
							</ul>
						</div>
					</div>
		}
		return null;
	}

	renderInference(ptype){
		return 	<div className="personaltype centered">
					inferred <strong>{ptype.type}</strong> data
			    </div>
	}

	renderRaw(ptype){
		return 	<div className="personaltype centered">
					{ptype.type}
			    </div>
	}

	renderType(ptype){
		return <div className="noborder">
			{ptype.ordinal === "secondary" && this.renderInference(ptype)}
			{ptype.ordinal === "primary" && this.renderRaw(ptype)}
		</div>

	}

	renderSubtype(ptype){
		if (ptype.subtype){
			return 	<div className="noborder">
						<div className="centered personaltype">
							{ptype.subtype}
						</div>
					</div>
		}
		return null;
	}
	renderPrivacy(node){
		if (!node){
			return null;
		}

		if (node.schema && node.schema.output){


			const personal = (Object.keys(node.schema.output.ptype || {})).reduce((acc,key)=>{

				return [...acc,  node.schema.output.ptype[key].map((ptype)=>{
					const iconstyle = {
						background: _colours[ptype.type]
					}
					
					return <div>
								<div className="flexrow">
									<div className="personalicons">
										<div className="flexcolumn" style={{width:50, padding:8}}>
											{this.renderType(ptype)}
											<div className="noborder">	
												<div className="circle centered" style={iconstyle}>{ptype.type[0]}</div>
											</div>
											{this.renderSubtype(ptype)}
										</div>
									</div>
									<div style={{paddingLeft:10}}>
										<div className="flexcolumn">
											<div className="noborder">
												<div className="personaltitle">Description</div>
											</div>
											<div className="noborder">
												<div className="personalcontent">{ptype.description}</div>
											</div>
											
											{this.renderTitle(ptype, "evidence", "Evidence for inference")}
											{this.renderEvidence(ptype)}

											{this.renderTitle(ptype, "conditions", "Conditions required for inference")}
											{this.renderConditions(ptype)}
										</div>
									</div>
								</div>
								<hr/>
							</div>
					
				})];

			},[]);
		
			return <div> {personal} </div>
		};

		return null;
		
	}

	renderContent(){
		const {subtype="", node={}} = this.props;
		

		let description = "";

		if (node){
			if (node._def.descriptionfn){
				description = node._def.descriptionfn(node);
			}else{
				description = node.description;
			}
		}

		switch (subtype){
			case "description":
				return this.renderDescription(description);
			case "expected input":
				return this.renderInputs(node)
			case "output data":
				return this.renderOutputs(node)
			case "personal data":
				return this.renderPrivacy(node)
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