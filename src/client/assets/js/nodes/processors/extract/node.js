import {configNode} from 'utils/ReactDecorators';
import React, {Component} from 'react';
import "./filter.scss";
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';


const _inputsChanged = (previous, inputs)=>{

	if (!previous){
		return true
	}	

	if (Object.keys(inputs).length != Object.keys(previous).length){
		return true;
	}

	return Object.keys(inputs).reduce((acc, key)=>{
		return acc && inputs[key] !== previous[key];
	}, true);

	
}

@configNode()
export default class Node extends React.Component {

	constructor(props){
		super(props);
		const {values:{filters}} = props;
		this._toggleFilter = this._toggleFilter.bind(this);
		this.state = { selections:  filters};
	}

	renderItem(sid, stype, name, item, path){
		
		

		if (item.type ===  "object"){
			return 	<ul className="filterList">
						<li><strong>{name}</strong></li>
						{this.renderSchemaObject(sid, stype, item.properties, path)}
					</ul>
					
		}
		else if(item.type === "array" && item.items && Array.isArray(item.items)){
			return 	<ul className="filterList">
						<li><strong>{name}</strong></li>
						{this.renderSchemaArray(sid, stype, item.items, path)}
					</ul>
		}
		else{
			
			const checked = this.state.selections.filter(f=>f.sid===sid).map(f=>f.path.join()+f.stype).indexOf(path.join()+stype) !== -1;
			
			return <li> 
						<div className="flexrow">
							<div className="fixed" style={{width: 150}}>

								<input type="checkbox" 
									name={name}
								  	onChange={this._toggleFilter.bind(null, sid, stype, item, path)}
								  	checked={checked}/>
								<label>{name}</label>
							</div>
							
							<div className="filter-description" dangerouslySetInnerHTML={{__html: item.description}}></div>
						</div>

				   </li>
		}
	}

	renderSchemaArray(sid,stype, items, path=[]){
		console.log("in render schema array!",items);
		return items.map((item)=>{
			return this.renderItem(sid, stype, item.id, item, path);
		});
	}

	renderSchemaObject(sid, stype, schema, path=[]){
		return Object.keys(schema).map((key,i)=>{
			const item = {...schema[key], name:key}
			if (item.oneOf){
				console.log("seen an item.oneOf", item.oneOf);

				return this.renderSchemaArray(sid, stype, item.oneOf, path);
			}
			return <ul className="filterList" key={i}> {this.renderItem(sid, stype, key, item, [...path, key])} </ul>
		});
		
	}
	
	renderFilters(sources){
		return sources.map((source, i)=>{
			return <div key={i}>
						<h3>{source.type}</h3>
						<div className="filter-divider" />
						<div>{this.renderSchemaObject(source.id, source.type, source.schema.properties, [])}</div>
					</div>
		})
	}	

	componentDidMount(){
	   		
	   	const {values:{previousinputs}, inputs=[]} = this.props

	   	const _inputs = inputs.reduce((acc,i)=>{
	   		acc[i.id] = i.subtype || null;
	   		return acc;
	   	},{});

		const changed = _inputsChanged(previousinputs, _inputs);

	   	if (changed){
	   		this.setState({selections: []});
	   		this.props.updateNode("filters", []);
	   	}
	   		
	   	this.props.updateNode("previousinputs", _inputs);
	}

	render(){

		const {inputs = [],values={}, updateNode} = this.props;

		const nameprops = {	
			 value: values.name || "",
			 id: "name",
			 onChange:(property, event)=>{
				 updateNode(property, event.target.value);
			 }
		}
							
		const nameinput = 	<div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>


		const sources = inputs.reduce((acc, node)=>{
			const {schema:{output}} = node;
			if (output){
				acc = [...acc, {type:node.type, id:node.id, schema:output}];
			}
			return acc;
		},[]) 

		return <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"data"} content={this.renderFilters(sources)}/>
          			</Cells>
            	</div>
	}

	//can we not pass in ptype here?

	_toggleFilter(sid, stype, item, path, event){
		
		console.log("toggle filter!!", sid);
		const target = event.target;
		const checked = target.checked;
		let _filters;

		if (!checked){
			_filters = this.state.selections.filter((filter)=>{
				if (filter.sid != sid)
					return true;
				if (filter.path.join() !== path.join())
					return true;
				
				return false;
			});
		}else{
			_filters = [...this.state.selections, {sid,stype,item,path}];
		}
	
		this.setState({selections: _filters});
		//need to resolve input schemas privacy against filters!

		
		this.props.updateNode("filters", _filters);
	}

}