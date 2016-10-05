import React, { Component } from 'react';
import {TOOLBAR_HEIGHT, INFO_HEIGHT, NODE_EDITOR_PADDING} from '../constants/ViewConstants';
import {fitText} from '../utils/utils';

class NodeEditor extends Component {
	
	constructor(props){
		super(props);
	}

	render(){

	  	const {node, description} = this.props;
	  	
		const editorstyle = {
			position: 'absolute',
			maxHeight: this.props.height - (2 * NODE_EDITOR_PADDING),
			width: this.props.width - (2* NODE_EDITOR_PADDING),
			top: this.props.top + NODE_EDITOR_PADDING, 
			left:  this.props.left + NODE_EDITOR_PADDING, 
			background: 'white',
			overflow: 'auto',
			boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
			border: '1px solid #d3d3d3',
		}
		
		const infostyle = {
			//height: INFO_HEIGHT,
			background: 'white',
		}
		
		
		const contentstyle={
			//height: this.props.height - TOOLBAR_HEIGHT - INFO_HEIGHT,
		}
		
		const toolbarstyle = {
			height: TOOLBAR_HEIGHT,
			background: '#445662',
			//width: this.props.width,
		}
		
		const iconstyle = {
            alignSelf: 'center',
            color:'white',
            background: node._def.color || '#ca2525',
            border: '2px solid white', 
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            color: 'white',
            height: '7em',
            width: '7em',
            lineHeight: '10em',
        }
        
        const descriptionstyle = {
        	color: '#4d4d4d',
        	background: 'white',
        	textAlign: 'left',
        	WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            overflow: 'auto',
            width: '100%',
            paddingLeft: 10,
            paddingBottom: 20,
            paddingTop: 15,
            fontSize: '1em',
            height: 140,
        }

		
		
			
        const namestyle = {
        	fontSize: fitText(node.type || "", {width: "118px", padding: '16px', textAlign:'center'}, 40, 118)
        }

		return <div id="nodeeditor" style={editorstyle}>
				 <div style={infostyle}>
					<div className="flexcolumn">
						<div>
							<div className="flexrow" style={{background:'#445662', color: 'white'}}>
								<div style={{WebkitFlex: '0 0 auto'}}>
									<div className="flexcolumn">
										<div className="noborder">
											<div className="centered" style={{padding: '8px 10px 0px 10px'}}>
												<div style={iconstyle}><i className={`fa ${node._def.icon} fa-5x fa-fw`}></i></div>
											</div>
										</div>
										<div className="noborder">
											<div className="centered" style={{padding: '0px 10px 0px 10px'}}>
												<div style={namestyle}> {node.type} </div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<div className="flexcolumn">
										<div className="noborder">
											<div style={descriptionstyle}>	
												<div dangerouslySetInnerHTML={{__html: description}}></div>
											</div>
										</div>
										<div className="noborder" style={{minHeight:10}}>
												<div style={{background:'white', width:'100%'}}></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				 </div>	 	
				 <div style={contentstyle}>
				 	{this.props.children}
				 </div>
				 <div style={toolbarstyle}>
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

NodeEditor.defaultProps ={
   ok: ()=>{console.warn("no ok callback provided as prop!")},
   cancel:()=>{console.warn("no cancel callback provided as prop!")},
}

export default NodeEditor