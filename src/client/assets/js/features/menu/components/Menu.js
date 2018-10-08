import React, { Component } from 'react';
import { Link } from 'react-router';
import './menu.css';

//<Link to="/driver"><img src="images/createdriver.svg" width="100%"/></Link>
//<Link to="/app"><img src="images/createapp.svg" width="100%"/></Link>

export default class Menu extends Component {
	render() {
		console.log("in render menu");
		return <div className="menu">

			<div className="appheader">
			</div>
			<div className="app">
				<Link to="/app"><img src="images/createapp.svg" width="100%" /></Link>
			</div>
			<div className="appfooter">
				create an app
					</div>

			<div className="driverheader">
			</div>
			<div className="driver">
				<Link to="/driver"><img src="images/createdriver.svg" width="100%" /></Link>
			</div>
			<div className="driverfooter">
				create a driver
					</div>
		</div>

	}
}