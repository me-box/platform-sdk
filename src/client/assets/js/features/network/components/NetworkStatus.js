import React, {Component} from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH} from 'constants/ViewConstants';
//import '../../../../styles/cells.scss';
import cx from 'classnames';
import { actionCreators as networkActions, selector } from '../';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(networkActions, dispatch),
  }
})
export default class NetworkStatus extends Component {
	
	render() {
		
		const {network:{status}} = this.props;
		
		
		const style ={
			position: 'absolute',
			top: TOOLBAR_HEIGHT,
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
	
		let _status = null;
		
		if (status){
			const icon = cx({
				fa: true,
				'fa-4x': true,
				'fa-fw': true,
				'fa-cog': status === 'access',
				'fa-spin' : status === 'access',
				'fa-times'	: status === 'error',
				'fa-check'	: status === 'success',
			})
		
			_status = <div style={style}>
						<div className="flexcolumn">
							<div>
								<div className="centered">
										<div style={noborder}>
											<i className={icon}></i>
											<div style={messagestyle}>{status.message}</div>
										</div>
								</div>
							</div>
						</div>
			    	 </div>
		}

		return _status;	
	}
}