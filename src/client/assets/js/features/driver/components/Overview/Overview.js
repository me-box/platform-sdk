import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Overview extends React.Component {
	render(){ 
		return 	<div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Is your driver a <strong> cloud </strong> or a <strong>hardware</strong> driver?  A cloud driver gets its data from a cloud service (e.g. facebook, twitter, google).  A hardware driver gets its data from a IoT device (e.g Phillips Hue bulbs)
							</div>
							<div className="attribute">
								<div className="attribute-grid">
									<div className="driverbutton">hardware</div>
									<div className="driverbutton">cloud</div>
								</div>
							</div>
							
						</div>
					</div>
					<div className="panel">
						<div className="cell">
						<div className="description">
								Give your driver a <strong>name</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="driver name"/>
							</div>
						</div>	
					</div>
					<div className="panel">
						<div className="cell">
						<div className="description">
								Give your driver a <strong>description</strong>
							</div>
							<div className="attribute">
								<input type="text"  placeholder="driver description"/>
							</div>
						</div>	
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								please choose an open-source license - we recommend <strong>MIT</strong>
							</div>
							<div className="attribute">
								<div className="attribute-grid">
									<div className="driverbutton">MIT</div>
									<div className="driverbutton">GPL-3.0</div>
									<div className="driverbutton">LGPL-3.0</div>
									<div className="driverbutton">AFL-3.0</div>
									<div className="driverbutton">BSD-2</div>
									<div className="driverbutton">BSD-3</div>
									<div className="driverbutton">Apache-2</div>
									<div className="driverbutton">ISC</div>
								</div>
							</div>
							
						</div>
					</div>
					<div className="panel">
						<div className="cell">
						<div className="description">
								Driver <strong>tags</strong>
							</div>
							<div className="attribute">
								<input type="text"  placeholder="comma separated list of tags"/>
							</div>
						</div>	
					</div>
				</div>
			
	}
}