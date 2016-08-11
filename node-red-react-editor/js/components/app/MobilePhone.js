import React, { Component } from 'react';
import '../../../style/sass/cells.scss';
import '../../../style/css/devices.min.css';

class MobilePhone extends Component {
	
	constructor(props){
		super(props);
	} 

	render() {
		const style={
			color: 'black',
			overflowY:'auto'
		}
	
		const {content} = this.props;
		return <div className="marvel-device iphone6 silver">
					<div className="top-bar"></div>
					<div className="sleep"></div>
					<div className="volume"></div>
					<div className="camera"></div>
					<div className="sensor"></div>
					<div className="speaker"></div>
					<div className="screen" style={style}>
						{content}
					</div>
					<div className="home"></div>
					<div className="bottom-bar"></div>
				</div>
	}
};

export default MobilePhone;
