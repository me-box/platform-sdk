import React, { Component } from 'react';
import '../../style/sass/cells.scss';

class Cells extends Component {
	
	constructor(props){
		super(props);
	} 

	render() {
		return (<div className="flexcolumn">
					{this.props.children}
				</div>)
	}
};

export default Cells;
