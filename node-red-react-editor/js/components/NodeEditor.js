import React, { Component } from 'react';
import {TOOLBAR_HEIGHT, INFO_HEIGHT} from '../constants/ViewConstants';
import {fitText} from '../utils/utils';

class NodeEditor extends Component {
	
	constructor(props){
		super(props);
	}

	render(){

	  	const {node} = this.props;
	  	
		const editorstyle = {
			position: 'absolute',
			//height: this.props.height,
			width: this.props.width - 20,
			top: this.props.top + 10, 
			left:  this.props.left + 10, 
			background: 'white',
			overflow: 'auto',
			boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
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
        	color: 'black',
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
            maxHeight: 150,
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
											<div className="centered" style={{paddingTop:8}}>
												<div style={iconstyle}><i className={`fa ${node._def.icon} fa-5x fa-fw`}></i></div>
											</div>
										</div>
										<div className="noborder">
											<div className="centered">
												<div style={namestyle}> {node.type} </div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<div style={descriptionstyle}>	
        								<div dangerouslySetInnerHTML={{__html: node._def.description}}></div>
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
				 						<a className="button selected" onClick={this.props.ok}>ok</a>
				 					</div>
				 				</div>
				 				<div>
				 					<div className="centered">
				 						<a className="button selected" onClick={this.props.cancel}>cancel</a>
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