import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Resources extends React.Component {
	render(){ 
			return <div>
						<div className="panel">
							<div className="cell">
								<div className="description">
									 resources
								</div>
								<div className="attribute">
									<input type="text" placeholder="databox-store-blob"/>
								</div>
							</div>
						</div>
					</div>

	}
}