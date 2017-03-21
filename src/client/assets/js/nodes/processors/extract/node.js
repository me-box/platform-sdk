import {configNode} from 'utils/ReactDecorators';
import React, {Component} from 'react';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import "./filter.scss";
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';
@configNode()
export default class Node extends React.Component {

	constructor(props){
		super(props);
		const {values:{filters}} = props;
		this._toggleFilter = this._toggleFilter.bind(this);
		this.state = { selections:  filters };
	}

	renderItem(source, name, item, path){
		if (item.type ===  "object"){
			return 	<ul className="filterList">
						<li><strong>{name}</strong></li>
						{this.renderSchema(source, item.properties, path)}
					</ul>
					
		}else{
			const checked = this.state.selections.map(f=>f.path.join()+f.source).indexOf(path.join()+source) !== -1;

			return <li> 
						<div className="flexrow">
							<div className="fixed" style={{width: 150}}>
							<Checkbox id="filterItem"
								  name={name}
								  onChange={this._toggleFilter.bind(null, source, item, path)}
								  checked={checked}
								  label={name}/>
							</div>
							<div className="filter-description" dangerouslySetInnerHTML={{__html: item.description}}></div>
						</div>

				   </li>
		}
	}

	renderSchema(source, schema, path=[]){
		return Object.keys(schema).map((key,i)=>{
			const item = Object.assign({}, schema[key], {name:key});
			return <ul className="filterList" key={i}> {this.renderItem(source, key, item, [...path, key])} </ul>
					

		});
	}
	
	renderFilters(sources){
		return sources.map((source, i)=>{
			return <div key={i}>
						<h3>{source.type}</h3>
						<div className="filter-divider" />
						<div>{this.renderSchema(source.type, source.schema)}</div>
					</div>
		})
	}	

	render(){
		const {inputs = [], values={}, updateNode} = this.props;
		
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
				acc.push({type:node.type, schema:output});
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

	_toggleFilter(source, item, path, checked){
		
		let _filters;

		if (!checked){
			_filters = this.state.selections.filter((filter)=>{
						return filter.source === source && filter.path.join() != path.join();
					   });
		}else{
			_filters = [...this.state.selections, {source,item,path}];
		}

		this.setState({selections: _filters});
		this.props.updateNode("filters", _filters);
	}

}