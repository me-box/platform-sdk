import React, { Component } from 'react';
import '../../style/sass/cells.scss';

class Cell extends Component {
	
	constructor(props){
		super(props);
	} 

	render() {
		return (<div>
			<div className="flexrow">
				<div className="title">
					<div className="centered">
						{this.props.title}
					</div>
				</div>
				<div> 
					{this.props.content}
				 </div>
			</div>
		</div>);
	}
};



export default Cell;
