import React from 'react';

import DataType from './DataType';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as driverActions, selector } from '../../';


@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(driverActions, dispatch),
  }
})
export default class Data extends React.Component {

	constructor(props){
		super(props);
		this.state={showdatatypes:false, add:false}
		this.renderDataTypes = this.renderDataTypes.bind(this);
		this.renderSchema = this.renderSchema.bind(this);
		this.addSchema = this.addSchema.bind(this);
	}


	addSchema(id){
		if (this.state.add){
			this.props.actions.addSchema(id);
		}
		this.setState({showdatatypes:false, add:false});
	}

	renderDataTypes(){

		const {driver:{dataTypes}} = this.props;

		const items = dataTypes.map((id)=>{
			return <DataType key={id} id={id} addSchema={this.addSchema}/>
		})

		return <div className="modal">
					<div className="modal-content">
						<div className="modal-header">
							<span className="close" onClick={()=>this.setState({showdatatypes:false})}>&times;</span>
						    <h2>select data type</h2>
						</div>
						<div className="modal-body">
							<div className="datagrid">
								{items}
							</div>
						</div>
						<div className="modal-footer">
								    
						</div>
					</div>
				</div>
	}


	renderSchema(){
		const {driver:{schema}} = this.props;
		
		const addnew = <tr>
							<td><input type="text" placeholder="field name"/></td>
							<td>
								<div className="option">
									<label onClick={()=>this.setState({showdatatypes:true, add:true})}>field type</label>
								</div>
							</td>
							<td>
								<div className="optionsgrid">
									<div className="option"><label>blank</label></div>
									<div className="option"><input type="text" placeholder="0"/></div>
									<div className="option"><label>fn</label></div>
									<div className="option"><input type="text" placeholder="fn"/></div>
									<div className="option"><span className="close">&times;</span></div>
								</div>
							</td>		
						</tr>

		const existing = schema.map((s,i)=>{
			return 	<tr key={i}>
						<td><input type="text" placeholder="field name"/></td>
						<td>
							<div className="option">
								<label onClick={()=>this.setState({showdatatypes:true, add:false})}>{s.schema.name}</label>
							</div>
						</td>
						<td>
							<div className="optionsgrid">
								<div className="option"><label>blank</label></div>
								<div className="option"><input type="text" placeholder="0"/></div>
								<div className="option"><label>fn</label></div>
								<div className="option"><input type="text" placeholder="fn"/></div>
								<div className="option"><span className="close">&times;</span></div>
							</div>
						</td>		
					</tr>

		});

		const rows = [...existing, addnew];

		return 	<table className="drivertable">
					<thead>
						<tr>
							<th> field name </th>
							<th> type </th>
							<th> options </th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
	}

	render(){ 
			return <div>
						<div className="panel">
							
							<div className="cell">
								<div className="description">
									 Use this to describe the <strong>structure</strong> of the data that is emitted from your driver.  This schema will also be used to create synthetic <strong> test data </strong> to test the driver in the sdk.
								</div>
								<div className="attribute">
									{this.renderSchema()}
								</div>
							</div>

						</div>

						<div className="panel">
							<div className="cell">
								<div className="description">
									Data <strong>format</strong>
								</div>
								<div className="attribute">
									<div className="attribute-grid">
										<div className="driverbutton">JSON</div>
										<div className="driverbutton">XML</div>
										<div className="driverbutton">CSV</div>
									</div>
								</div>
							</div>
						</div>

						<div className="panel">
							<div className="cell">
								<div className="description">
									Data <strong>frequency</strong>
								</div>
								<div className="attribute">
									
								</div>
							</div>
						</div>

						{this.state.showdatatypes && this.renderDataTypes()}
					</div>

	}
}