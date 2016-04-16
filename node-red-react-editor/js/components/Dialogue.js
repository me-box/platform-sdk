import React, { Component } from 'react';

class Dialogue extends Component {
	
	constructor(props){
		super(props);
	}

	render(){

		const dialoguestyle = {
			position: 'absolute',
			height: 'auto',
			width: '500px',
			top: '238px', 
			left: '476px', 
			display: 'block',
		}

		const dialogueprops = {
			//key: this.props.node.id,
			tabIndex: "-1",
			role:"dialog",
			"aria-describedby":"dialog",
			"aria-labelledby":"ui-id-5", 
		}

		const dialoguecontentstyle={
			display: 'block',
			width: 'auto',
			minHeight: '7px',
			maxHeight: 'none',
			height: 'auto',
		}

		const handlestyle={
			zIndex: 90,
		}

		console.log("ok children are");
		console.log(this.props.children);


		return <div className="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-no-close ui-dialog-buttons ui-draggable ui-resizable" {...dialogueprops} style={dialoguestyle}>
				 	<div className="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">
				 		<span id="ui-id-5" className="ui-dialog-title">hello</span>
			 			<button className="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button" aria-disabled="false" title="close">
			 				<span className="ui-button-icon-primary ui-icon ui-icon-closethick"></span>
			 				<span className="ui-button-text">close</span>
			 			</button>
				 	</div>
				 	<div className="hide ui-dialog-content ui-widget-content" style={dialoguecontentstyle}>
				 		{this.props.children}
					</div>
					<div className="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
						<div className="ui-dialog-buttonset">
							<button type="button" id="node-dialog-ok" className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false">
								<span className="ui-button-text">Ok</span>
							</button>
							<button type="button" id="node-dialog-cancel" className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false">
								<span className="ui-button-text" onClick={this.props.cancel}>Cancel</span>
							</button>
						</div>
					</div>
					<div className="ui-resizable-handle ui-resizable-n" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-e" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-s" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-w" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-sw" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-ne" style={handlestyle}></div>
					<div className="ui-resizable-handle ui-resizable-nw" style={handlestyle}></div>
				</div>

		
	}
}

Dialogue.defaultProps ={
   ok: ()=>{console.warn("no ok callback provided as prop!")},
   cancel:()=>{console.warn("no cancel callback provided as prop!")},
}

export default Dialogue