import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Overview extends Component {
	render(){ 
		return 	<div>
					<div className="panel">
						type [hardware / software]
					</div>
					<div className="panel">
						name
					</div>
					<div className="panel">
						description 
					</div>
					<div className="panel">
						license
					</div>
					<div className="panel">
						tags
					</div>
				</div>
			
	}
}