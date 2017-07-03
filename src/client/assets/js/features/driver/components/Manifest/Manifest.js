import React, { Component } from 'react';
import { Link } from 'react-router';
import "../driver.css";

export default class Manifest extends Component {

	

	render(){ 

		const {props:{children}} = this.props.children;

		return <div className="container">
			<div className="toolbar">
			</div>

			<div className="manifest">
				<Link to="/driver/manifest/">manifest</Link>
			</div>
			
			<div className="code">
				<Link to="/driver/code/">code</Link>
			</div>

			<div className="logo">
				databox
			</div>
			<div className="divider">
			</div>
			<div className="drivermenu">

				<div className="menuItem selected">
					<Link to="/driver/manifest/overview">overview</Link>
				</div>
			
				<div className="menuItem">
					<Link to="/driver/manifest/author">author</Link>
				</div>
				
				<div className="menuItem">
					<Link to="/driver/manifest/hardware">hardware</Link>
				</div>

				<div className="menuItem">
					<Link to="/driver/manifest/resources">resources</Link>
				</div>

				<div className="menuItem">
					<Link to="/driver/manifest/data">data</Link>
				</div>

				<div className="menuItem">
					<Link to="/driver/manifest/publish">PUBLISH</Link>
				</div>
			</div>
			<div className="content">
				{children}
			</div>
		</div>
	}
}