import React, { Component } from 'react';
import './styles/cells.scss';

class Cells extends React.Component {
	
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
