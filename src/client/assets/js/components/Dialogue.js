import React, { Component } from 'react';
import {NODE_EDITOR_PADDING, PALETTE_WIDTH, TOOLBAR_HEIGHT} from 'constants/ViewConstants';
import Toolbar from 'react-md/lib/Toolbars';
import './styles/dialogue.scss';
import Button  from 'react-md/lib/Buttons';

class Dialogue extends Component {

	render(){

		const dialoguestyle = {
			position: 'absolute',
			maxHeight: `calc(100vh - ${2 * NODE_EDITOR_PADDING}px)`,
			width: `calc(100vw - ${ (2 * NODE_EDITOR_PADDING) + PALETTE_WIDTH}px)`,
			top: NODE_EDITOR_PADDING, 
			left: NODE_EDITOR_PADDING, 
			background: 'white',
			overflow: 'auto',
			boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
			border: '1px solid #d3d3d3',
			
		}

	
		const close = <Button icon onClick={this.props.close}>close</Button>;
		
		return  <div className="sdkdialogue" style={dialoguestyle}>
					<Toolbar
		      			colored
		      			title={this.props.title}
		        		actions={close}
		        		nav={this.props.nav}
		        		className="md-divider-border md-divider-border--bottom"
		      		/>
		      		
					{this.props.children}
					<div className="sdktoolbar">
					 	<div className="flexcolumn">
					 		<div>
					 			<div className="flexrow">
					 				<div>
					 					<div className="centered">
					 						<button className="button selected" onClick={this.props.ok}>ok</button>
					 					</div>
					 				</div>
					 				<div>
					 					<div className="centered">
					 						<button className="button selected" onClick={this.props.cancel}>cancel</button>
					 					</div>
					 				</div>
					 			</div>
					 		</div>
					 	</div>
				 	</div>	 	
				</div>
		
	}

	
}

Dialogue.defaultProps ={
   ok: ()=>{console.warn("no ok callback provided as prop!")},
   cancel:()=>{console.warn("no cancel callback provided as prop!")},
   close: ()=>{console.warn("no close callback provided as prop!")},
   nav: null,
   title: "",
}

export default Dialogue