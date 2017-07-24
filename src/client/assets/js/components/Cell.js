import React, { Component } from 'react';
import './styles/cells.scss';

class Cell extends React.Component {
	
	constructor(props){
		super(props);
	} 

	render() {
		return (<div>
			<div className="flexrow" style={{flexBasis:0, overflow:'auto'}}>
				{this.props.title && <div className="title">
					<div className="centered">
						{this.props.title}
					</div>
				</div>}
				<div> 
					{this.props.content}
				 </div>
			</div>
		</div>);
	}
};



export default Cell;
