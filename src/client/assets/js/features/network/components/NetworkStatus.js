import React from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH} from 'constants/ViewConstants';
import '../../style/sass/cells.scss';
import cx from 'classnames';

class NetworkStatus extends React.Component {
	
	render() {
		
		let status = null;
		
		const style ={
			position: 'absolute',
			top: 0,
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
			background: 'rgba(255,255,255,0.8)',
			color: 'black',
		}
		
		const noborder = {
			border: 'none',
		}
		
		const messagestyle = {
			fontSize: '1.5em',
			paddingTop: 10,
		}
	
		
		
		if (this.props.status.status){
			const icon = cx({
				fa: true,
				'fa-4x': true,
				'fa-fw': true,
				'fa-cog': this.props.status.status === 'access',
				'fa-spin' : this.props.status.status === 'access',
				'fa-times'	: this.props.status.status === 'error',
				'fa-check'	: this.props.status.status === 'success',
			})
		
			status = <div style={style}>
						<div className="flexcolumn">
							<div>
								<div className="centered">
										<div style={noborder}>
											<i className={icon}></i>
											<div style={messagestyle}>{this.props.status.message}</div>
										</div>
								</div>
							</div>
						</div>
			    	 </div>
		}

		return status;	
	}
}

export default NetworkStatus;