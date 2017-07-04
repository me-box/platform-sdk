import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Data extends Component {

	constructor(props){
		super(props);
		this.state={showdatatypes:false}
	}

	render(){ 
			return <div>
						<div className="panel">
							
							<div className="cell">
								<div className="description">
									 Use this to describe the <strong>structure</strong> of the data that is emitted from your driver.  This schema will also be used to create synthetic <strong> test data </strong> to test the driver in the sdk.
								</div>
								<div className="attribute">
									<table className="drivertable">
										<thead>
											<tr>
												<th> field name </th>
												<th> type </th>
												<th> options </th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td><input type="text" placeholder="field name"/></td>
												<td><input type="text" onClick={()=>this.setState({showdatatypes:true})} placeholder="field type"/></td>
												<td><input type="text" placeholder="options"/></td>
											</tr>
											<tr>
												<td>field two</td>
												<td>field two type</td>
												<td>field two options</td>
											</tr>
										</tbody>
									</table>

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

						{this.state.showdatatypes && <div className="modal">
							<div className="modal-content">
								<div className="modal-header">
									<span className="close" onClick={()=>this.setState({showdatatypes:false})}>&times;</span>
								    <h2>select data type</h2>
								</div>
								<div className="modal-body">
								    <div className="datagrid">
								    	<div className="datatype">
								    		<div className="typename">Boolean</div>
								    		<ul>
								    			<li>true</li> 
								    			<li>false</li>
								    		</ul>
								    	</div>
										<div  className="datatype">
											<div className="typename">Number</div>
											<ul>
												<li>0.2</li> 
												<li>0.45</li> 
												<li>3.45</li>
												<li>99</li>
											</ul>
										</div>
										<div  className="datatype">
											<div className="typename">String</div>
											<p>a random string</p>
										</div>
										<div className="datatype">
											<div className="typename">Custom List</div>
											<p>a selection from a list of values</p>
										</div>
										<div className="datatype">
											<div className="typename">Date</div>
											<ul>
												<li>07.04.2013</li>
												<li>07/04/13</li>
												<li>7th April 2013</li>
											</ul>
										</div>
										<div className="datatype">
											<div className="typename">Binomial Distribution</div>
											<p>generates numbers based on a binomial distribution with a given probablility of success</p>
										</div>
										<div className="datatype">
											<div className="typename">Blank</div>
											<p>a null value</p>
										</div>
										<div className="datatype">
											<div className="typename">Hex Colour</div>
											<ul>
												<li>#124a0b</li>
												<li>#fffaaa</li>
												<li>#000000</li>
											</ul>
										</div>
								    </div>
								</div>
								<div className="modal-footer">
								    
								</div>
							</div>
						</div>}
					</div>

	}
}