import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Hardware extends Component {
	render(){ 

		return <div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								 Hardware manufacturer <strong>name</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="manufacturer"/>
							</div>
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Hardware <strong>model</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="hardware model number"/>
							</div>	
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Hardware <strong>firmware</strong> version
							</div>
							<div className="attribute">
								<input type="text" placeholder="firmware version"/>
							</div>	
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Hardware <strong>iso standard</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="ISO standard code"/>
							</div>	
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Does the driver <strong>actuate</strong> the device?  
							</div>
							<div className="attribute">
								<div className="attribute-grid">
									<div className="driverbutton">yes</div>
									<div className="driverbutton">no</div>
								</div>
							</div>
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Does the driver <strong>export</strong> data?  
							</div>
							<div className="attribute">
								<div className="attribute-grid">
									<div className="driverbutton">yes</div>
									<div className="driverbutton">no</div>
								</div>
							</div>
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Data <strong>export api</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="export API"/>
							</div>	
						</div>
					</div>
				</div>
	}
}