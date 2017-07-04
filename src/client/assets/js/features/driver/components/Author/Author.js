import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Author extends Component {
	render(){ 
		return 	<div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								 Your <strong>name</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="your name"/>
							</div>
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Your github <strong>url</strong>
							</div>
							<div className="attribute">
								<input type="text" placeholder="your github repo"/>
							</div>	
						</div>
					</div>
					<div className="panel">
						<div className="cell">
							<div className="description">
								Your <strong>email</strong> address
							</div>
							<div className="attribute">
								<input type="text" placeholder="email address"/>
							</div>	
						</div>
					</div>
				</div>
	}
}