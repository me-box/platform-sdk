import React, { Component } from 'react';
import {TOOLBAR_HEIGHT, INFO_HEIGHT, NODE_EDITOR_PADDING} from '../constants/ViewConstants';
import {fitText} from '../utils/utils';
import {connect} from 'react-redux';
import Cell from '../components/Cell';
import Cells from '../components/Cells';

const _payload = function(schema, id, selectedid){
	return Object.keys(schema).map((key,i)=>{
		const item = schema[key];
		if (item.type === "object"){
			return <div key={i}>
				   		<div className="flexrow">
				   			<div className="attributetitle">
								<div className="centered">
									<strong>{key}</strong>
								</div>
							</div>
						
							<div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:100}}>
								<div className="centered">
									{item.type} 
								</div>
							</div>
							<div>
								<div className="flexcolumn">
									{_payload(item.schema, id, selectedid)}
								</div>
				   			</div>
				   		</div>
				   </div>
		}
		return <div key={i}>
				<div className="flexrow">
					<div className="attributetitle">
						<div className="centered">
							<strong>{key}</strong>
						</div>
					</div>
					<div className="fixed" style={{borderRight: '1px solid #b6b6b6', width:100}}>
						<div className="centered">
							{item.type} 
						</div>
					</div>
					<div style={{borderRight: '1px solid #b6b6b6'}}>
						<div className="centered">
							<div dangerouslySetInnerHTML={{__html: item.description.replace("[id]", id).replace("[selectedid]", selectedid)}}></div>
						</div>
					</div>
				</div>
		   </div>
	});
}


class NodeEditor extends Component {
	
	constructor(props){
		super(props);
		this._toggleShowOutputs = this._toggleShowOutputs.bind(this);
	   	this._toggleShowInputs = this._toggleShowInputs.bind(this);
	}

	
	render(){

	  	const {node, inputs, outputs, values, help} = this.props;
	  	
	  
	  
	  	const description = help ? help.description[node.id] ? help.description[node.id] : node._def.description() : node._def.description();
	  
		
	  
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
			overflow: 'auto',
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
		
		const inputdescription = inputs.map((input,i)=>{
				const schema = help.outputschema[input.id] ?  help.outputschema[input.id].output : input._def.schema ? input._def.schema().output : {}
				const props = {
						schema, 
						icon: input._def.icon,
						color: input._def.color, 
						id: input.id,
						selectedid: node.id,
				};
				return <Schema key={i} {...props}/> 
		});
			
		const outputdescription = outputs.map((output, i)=>{
				const schema =  output._def.schema ? output._def.schema().input : {};
				const props = {
						schema, 
						icon: output._def.icon,
						color: output._def.color, 
						id: output.id,
						selectedid: node.id,
				};
				return <Schema key={i} {...props}/> 
		});
			
		const inputtogglemsg = values.showinputs ? "click to hide" : "click to view";
		const outputtogglemsg = values.showoutputs ? "click to hide" : "click to view";
			
		
		const fninputs = <div className="flexrow" style={{flexBasis:0, maxHeight:200, overflow:'auto'}}>	
								{inputs.length > 0 && <div style={{flexBasis:0}}>
									<div className="flexcolumn">
										<div className="noborder" style={{background:'#333', color: 'white'}} onClick={this._toggleShowInputs}>
											<div className="centered" >
												there are {inputs.length} inputs to this function ({inputtogglemsg})
											</div>
										</div>	
										{this.props.values.showinputs && inputdescription}
									</div>
								</div>}
							</div>
								
		const fnoutputs =<div className="flexrow" style={{flexBasis:0, maxHeight:200, overflow:'auto'}}>		
							{outputs.length > 0 && <div style={{flexBasis:0}}>
								<div className="flexcolumn">
									<div className="noborder" style={{background:'#445662', color: 'white'}} onClick={this._toggleShowOutputs}>
										<div className="centered" >
											there are {outputs.length} recipients of data from this function {outputtogglemsg}
										</div>
									</div>
									{this.props.values.showoutputs && outputdescription}
								</div>
							</div>}
						</div>
							
		
		
		return <div id="nodeeditor" style={editorstyle}>
				 <div style={infostyle}>
					<div className="flexcolumn">
						<div className="noborder">
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
				 <Cells>
				 		{inputs.length > 0 && <Cell content = {fninputs} />}	
          				{outputs.length > 0 && <Cell content = {fnoutputs} />}	
          		</Cells>
				 <div style={contentstyle}> 	
				 	{React.cloneElement(this.props.children, {help})}
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
	
	_toggleShowInputs(){
       	this.props.updateNode("showinputs", !this.props.values.showinputs);
    }
       
    _toggleShowOutputs(){
     	this.props.updateNode("showoutputs", !this.props.values.showoutputs);
    }
}


class Schema extends React.Component {

	render(){
		const iconcontainer ={
			color:'white',
			background: this.props.color || '#ca2525',
			border: '2px solid white', 
			textAlign: 'center',
			boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
			color: 'white',
			height: '100%',
			justifyContent: 'center',
			display: 'flex'
		}
	
		const payload = _payload(this.props.schema, this.props.id, this.props.selectedid);
		
		return 	<div key={this.props.id} className="flexcolumn">
					<div className="noborder">
						<div className="flexrow">
							<div className="fixed">
								<div style={iconcontainer}>
									<div style={{alignSelf:'center'}}>
										<i className={`fa ${this.props.icon} fa-2x fa-fw`}></i>
									</div>
								</div>
							</div>
							<div>
								<div className="flexcolumn">
									<div>
										<div className="flexrow">
											<div className="title">
												<div className="centered">
													attribute name
												</div>
											</div>
											<div className="header fixed" style={{width:100}}>
												<div className="centered">
												attribute type
												</div>
											</div>
											<div className="header">
												<div className="centered">
													description
												</div>
											</div>
										</div>
									</div>
									{payload}
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
