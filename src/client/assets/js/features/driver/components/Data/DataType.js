import React  from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as driverActions, selector } from '../../';


@connect(selector)
export default class DataType extends React.Component {

	constructor(props){
		super(props);
		this.addSchema = this.addSchema.bind(this);
	}

	addSchema(){
		const {id} = this.props;
		this.props.addSchema(id);
	}
	
	render(){

		const {type,id} = this.props;

		if (!type){
			return null;
		}

		const examples = type.example.map((e,i)=><li key={i}><i>{e}</i></li>);

		return <div className="datatype" onClick={this.addSchema}>
			<div className="typename">{id}</div>
			<p>{type.description}</p>
			<ul>
				{examples}
			</ul>
		</div>
	}
}