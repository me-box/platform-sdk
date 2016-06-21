import React from 'react';
import {TOOLBAR_HEIGHT, PALETTE_WIDTH, SIDEBAR_WIDTH} from '../constants/ViewConstants';
import cx from 'classnames';

class Publisher extends React.Component {
	
	constructor(props){
        super(props);
    }
	
	render() {
		
		const style ={
			position: 'absolute',
			left: PALETTE_WIDTH, 
			width: `calc(100vw - ${PALETTE_WIDTH}px)`,
			height: `calc(100vh - ${TOOLBAR_HEIGHT}px)`,
			background: 'rgba(255,255,255,0.9)',
		}
	
		return( <div style={style}>
					<h4> Publish </h4>
			    </div>
		);
	}
}

export default Publisher;