import React, { Component } from 'react';
import {TOOLBAR_HEIGHT, INFO_HEIGHT, NODE_EDITOR_PADDING, PALETTE_WIDTH} from 'constants/ViewConstants';
import {fitText, isFunction} from 'utils/utils';
import {connect} from 'react-redux';
import {selector} from 'features/editor';
import Toolbar from 'react-md/lib/Toolbars';
import Button  from 'react-md/lib/Buttons';
import Dialogue from 'components/Dialogue';
import {actionCreators as nodeActions} from '../../actions';
import { bindActionCreators } from 'redux';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import "./NodeEditor.scss";

const _oneof = function(schema, id, selectedid){

	return schema.map((item, i)=>{
	
		let tail = null;
	
		if (item.type === "object"){
			if (item.properties){
				tail = _payload(item.properties, id, selectedid)
			}
			if (item.oneOf){
				tail = _oneof(item.oneOf, id, selectedid)
			}
		}else{
			tail = _formatprimitive(item,i,id, selectedid);
		}
									
		return 	<div key={i}>
					<div className="flexcolumn">
						<div>
							<div className="centered"><strong>{item.description}</strong></div>
						</div>
						<div>
							<div className="flexcolumn">
								{tail}
							</div>
						</div>
					</div>
				</div>
	});
};

const _formatprimitive = function(item,key,id,selectedid){
	return <div key={key}>
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
}

const _formatobject = function(item,key,id,selectedid){
			return 	<div key={key}>
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
									{item.properties ? _payload(item.properties, id, selectedid) : null}
									{item.oneOf ? _oneof(item.oneOf, id, selectedid): null}
								</div>
							</div>
						</div>
				   	</div>
				
}

const _payload = function(schema, id, selectedid){
	
	if (!schema)
		return null;
		
	return Object.keys(schema).map((key,i)=>{
		const item = schema[key];
		if (item.type === "object"){
			return _formatobject(item,key,id, selectedid); 
		}			
		return _formatprimitive(item,key,id, selectedid);
	});
};

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(nodeActions, dispatch),
  }
})
export default class NodeEditor extends Component {
	
	constructor(props){
		super(props);
		this.state = {showhelp:false};
		this._toggleInfo = this._toggleInfo.bind(this);
	}
	
	

	renderHelp(){

		const {node} = this.props;


		const infostyle = {
			height: INFO_HEIGHT,
			background: 'white'
		};

        const namestyle = {
        	fontSize: fitText(node.type || "", {width: "118px", padding: '16px', textAlign:'center'}, 40, 118),
        	color: 'white'
        }

		return <div style={infostyle}>
			<div className="flexcolumn">
				<div className="noborder">
					<div className="flexrow">
						<div style={{WebkitFlex: '0 0 auto'}}>
							<div className="flexcolumn" style={{background:"#333", width:"118px", height:"inherit"}}>
								<div className="noborder">
									<div className="centered" style={{width:"auto"}}>
										<div className="editor-icon" style={{background: node._def.color || '#ca2525'}}><i className={`fa ${node._def.icon} fa-5x fa-fw`}></i></div>
									</div>
								</div>
								<div className="noborder">
									<div style={{textAlign:"center", width:"100%", padding: '0px 10px 0px 10px'}}>
										<div style={namestyle}> {node.type} </div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="flexcolumn">
								<div className="noborder">
									<div className="editor-description">	
										<div dangerouslySetInnerHTML={{__html: node.description}}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	}


	renderInputsAndOutputs(){

		const {node, inputs=[], outputs=[]} = this.props;
		
		//dont show if app node or nothing to show
		if (["app", "uibuilder"].indexOf(node.type) != -1 || (inputs.length + outputs.length <= 0))
			return null;

		return <div id="schemas">	
				 	<div className="flexcolumn">
				 		<Cells>
				 			{inputs.length > 0 && <Cell content = {this.renderInputs()} />}	
          					{outputs.length > 0 && <Cell content = {this.renderOutputs()} />}	
          				</Cells>
          			</div>
          		</div>
	}

	renderInputs(){
		const {inputs=[], values, updateNode} = this.props;

		const inputdescription = inputs.map((node,i)=>{
				
				const props = {
						schema: node.schema ? node.schema.output || {} : {}, 
						icon: node._def.icon,
						color: node._def.color, 
						id: node.id,
						selectedid: node.id,
				};
				return <Schema key={i} {...props}/> 
		});

		const inputtogglemsg = values.showinputs ? "click to hide" : "click to view";

		const toggleInputs = ()=>{
 			updateNode("showinputs", !values.showinputs);
		};

		if (inputs.length <= 0){
			return null;
		}

		return  <div className="flexrow" style={{flexBasis:0, maxHeight:200, overflow:'auto'}}>	
					<div style={{flexBasis:0}}>
						<div className="flexcolumn">
							<div className="noborder" style={{background:'#333', color: 'white'}} onClick={toggleInputs}>
								<div className="centered" >
									there are {inputs.length} inputs to this function ({inputtogglemsg})
								</div>
							</div>	
							{values.showinputs && inputdescription}
						</div>
					</div>
				</div>
	}

	renderOutputs(){

		const{outputs=[],values,updateNode} = this.props;
		
		const outputdescription = outputs.map((node, i)=>{
				
				const schema = node.schema ? node.schema.input || {} : {}; 
				
				const props = {
						schema: schema.properties || schema.oneOf, 
						icon: node._def.icon,
						color: node._def.color, 
						id: node.id,
						selectedid: node.id,
				};
				return <Schema key={i} {...props}/> 
		});
			
		const outputtogglemsg = values.showoutputs ? "click to hide" : "click to view";

		const toggleOutputs = ()=>{
 			updateNode("showoutputs", !values.showoutputs);
		};

		if (outputs.length <= 0){
			return null;
		}

		return 	<div className="flexrow" style={{flexBasis:0, maxHeight:200, overflow:'auto'}}>		
					<div style={{flexBasis:0}}>
						<div className="flexcolumn">
							<div className="noborder" style={{background:'#424242', color: 'white'}} onClick={toggleOutputs}>
								<div className="centered" >
									there are {outputs.length} recipients of data from this function {outputtogglemsg}
								</div>
							</div>
							{this.props.values.showoutputs && outputdescription}
						</div>
					</div>
				</div>
	}

	render(){
		const {name, w, h} = this.props;
		const {showhelp} = this.state;

		//const {name} = this.props;
		const editorstyle = {
			position: 'absolute',
			zIndex: 20,
			maxHeight: h,
			width: w,
			top: 0 + NODE_EDITOR_PADDING, 
			left:  PALETTE_WIDTH + NODE_EDITOR_PADDING, 
			background: 'white',
			overflow: 'auto',
			boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
			border: '1px solid #d3d3d3',	
		}

		const close = this.props.actions.nodeConfigureOk;
		const info  = <Button icon onClick={this._toggleInfo}>info_outline</Button>;

		return  <Dialogue 
					title={`configure ${name}`} 
					close={close} 
					ok={this.props.actions.nodeConfigureOk} 
					cancel={this.props.actions.nodeConfigureCancel}
					nav={info}>
					{showhelp && this.renderHelp()}
					{this.renderInputsAndOutputs()}
					{this.props.children}
				</Dialogue>
	}

	_toggleInfo(){
		this.setState({showhelp: !this.state.showhelp});
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
		
		return 	<div key={this.props.id} className="flexcolumn schema">
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



/*/*		<div id="nodeeditor" style={editorstyle}>
					<Toolbar
		      			colored
		      			title={`configure ${name}`}
		        		actions={close}
		        		className="md-divider-border md-divider-border--bottom"
		      		/>
					{this.props.children}
				</div>

		
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
			height: INFO_HEIGHT,
			background: 'white',
		}
		
		
		const contentstyle={
			//height: this.props.height - TOOLBAR_HEIGHT - INFO_HEIGHT,
			overflow: 'auto',
		}
		
		const toolbarstyle = {
			height: TOOLBAR_HEIGHT,
			background: '#424242',
			//width: this.props.width,
		}
		
		const iconstyle = {
            alignSelf: 'center',
            color:'white',
            background: node._def.color || '#ca2525',
            textAlign: 'center',
            boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
            color: 'white',
            height: '7em',
            width: '7em',
            lineHeight: '10em',
        }
        
        const descriptionstyle = {
        	color: 'white',
        	textAlign: 'left',
        	WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            overflow: 'auto',
            width: '100%',
            paddingLeft: 15,
            paddingBottom: 30,
            paddingTop: 15,
            paddingRight: 15,
            fontSize: '1em',
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
				let schema = {};
				if (isFunction(output._def.schema)){
					schema = output._def.schema().input || {};
				}
		
				const props = {
						schema: schema.properties || schema.oneOf, 
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
									<div className="noborder" style={{background:'#424242', color: 'white'}} onClick={this._toggleShowOutputs}>
										<div className="centered" >
											there are {outputs.length} recipients of data from this function {outputtogglemsg}
										</div>
									</div>
									{this.props.values.showoutputs && outputdescription}
								</div>
							</div>}
						</div>
							
		
		//style={{WebkitFlex: '0 0 auto'}} div under flexrow background 445662
		
		return <div id="nodeeditor" style={editorstyle}>
				 <div style={infostyle}>
					<div className="flexcolumn">
						<div className="noborder">
							<div className="flexrow" style={{background:'#424242', color: 'white'}}>
								<div style={{WebkitFlex: '0 0 auto'}}>
									<div className="flexcolumn" style={{background:"black", width:"118px", height:"inherit"}}>
										<div className="noborder">
											<div className="centered" style={{width:"auto"}}>
												<div style={iconstyle}><i className={`fa ${node._def.icon} fa-5x fa-fw`}></i></div>
											</div>
										</div>
										<div className="noborder">
											<div style={{textAlign:"center", width:"100%", padding: '0px 10px 0px 10px'}}>
												<div style={namestyle}> {node.type} </div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<div className="flexcolumn">
										<div className="noborder" style={{fontSize: '1.5em',WebkitFlex: '0 0 auto', background: "#333", height:50, boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)'}}>
											<div className="centered">
												{`${node.type} info`}
											</div>
										</div>
										<div className="noborder">
											<div style={descriptionstyle}>	
												<div dangerouslySetInnerHTML={{__html: description}}></div>
											</div>
										</div>
									</div>
								</div>
								{node._def.category === "datastores" &&
								<div>
									<div className="flexcolumn">
										<div className="noborder" style={{width:"100%", padding:10, background:"#303030", }}>
											<svg width="300px" height="250px">
											
											</svg>
										</div>
									</div>
								</div>}
							</div>
						</div>
					</div>
				 </div>	 
				{node.type !== "app" &&
				 <div id="schemas">	
				 	<div className="flexcolumn">
				 		<Cells>
				 			{inputs.length > 0 && <Cell content = {fninputs} />}	
          					{outputs.length > 0 && <Cell content = {fnoutputs} />}	
          				</Cells>
          			</div>
          		</div>}
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
			  </div>*/
