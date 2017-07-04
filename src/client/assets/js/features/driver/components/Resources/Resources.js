import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Resources extends Component {
	render(){ 
			return <div>
						<div className="panel">
							<div className="cell">
								<div className="description">
									 resources
								</div>
								<div className="attribute">
									<input type="text" placeholder="resources"/>
								</div>
							</div>
						</div>
					</div>

	}
}