import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import {matchLibraries} from '../../../utils/utils';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';



const _payload = function(schema, id, selectedid){
	return Object.keys(schema).map((key,i)=>{
		const item = schema[key];
		if (item.type === "object"){
			return <div key={i}>
				   		<div className="flexrow">
				   			<div className="title">
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
					<div className="title">
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

const _schema = function(schema, node, selectedid){
	
	const props = {
			schema, 
			icon: node._def.icon,
			color: node._def.color, 
			id: node.id,
			selectedid,
	};
							  
	return <Schema {...props}/>  
}

class Node extends React.Component {

       render() {
          
        	const {selected, inputs, outputs, help} = this.props;
            
            const libraries = <div style={{padding: 8}}>
            					<strong>{matchLibraries(this.props.values.func || this.props.selected.func || "").join(", ")}</strong>
            				  </div>
       		
			const nameprops = {	
									value: 	this.props.values.name || this.props.selected.name || "",
									id: "name",
									onChange:(property, event)=>{
										 this.props.updateNode(property, event.target.value);
									}
								}
							
			const nameinput = <div className="centered">
									<Textfield {...nameprops}/>												
								  </div>
	
		
			const outputprops = {
				options: [
					                {name: '1', value: 1},
					                {name: '2', value: 2},
					                {name: '3', value: 3},
					                {name: '4', value: 4},
					                {name: '5', value: 5},
					     ],
					     
				onSelect: (event)=>{
					this.props.updateNode("outputs", parseInt(event.target.value));
				},
				style: {width: '100%'},
				value: this.props.values.outputs || this.props.selected.outputs || "",
			}
			
			const outputselect = <div className="centered">
									<Select {...outputprops}/>												
						  		 </div>
        	
        	var aceprops = {
        		onChange: (value)=>{
        			 this.props.updateNode("func", value);
        		},
        		value: this.props.values.func || this.props.selected.func || "",
        		mode: "javascript",
        		theme: "github",
        		name: selected.id,
        		editorProps:{$blockScrolling: true},
        		height: '300px',
        		width: '100%',
        	}
        	
        	const codeinput = <AceEditor {...aceprops}/> 
			
			
			const inputdescription = inputs.map((input)=>{
				const schema = help.outputschema[input.id] ?  help.outputschema[input.id].output : input._def.schema ? input._def.schema().output : {};
				return _schema(schema, input, selected.id);
			});
			
			const outputdescription = outputs.map((output)=>{
				const schema =  output._def.schema ? output._def.schema().input : {};
				return _schema(schema, output, selected.id);
			});
			
			const inputsoutputs = <div className="flexrow" style={{flexBasis:0, maxHeight:200, overflow:'auto'}}>	
										{inputs.length > 0 && <div style={{flexBasis:0}}>
											<div className="flexcolumn">
												<div className="noborder" style={{background:'#333', color: 'white'}}>
													<div className="centered" >
														there are {inputs.length} inputs to this function
													</div>
												</div>	
												{inputdescription}
											</div>
										</div>}
										{outputs.length > 0 && <div style={{flexBasis:0}}>
											<div className="flexcolumn">
												<div className="noborder" style={{background:'#445662', color: 'white'}}>
													<div className="centered" >
														there are {outputs.length} recipients of data from this function
													</div>
												</div>
												{outputdescription}
											</div>
										</div>}
									</div>
								  				
          	return <div>
          			<Cells>		
          				<Cell content = {inputsoutputs} />							
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"external libraries"} content={libraries}/>
						<Cell title={"function"} content={codeinput}/>
						<Cell title={"outputs"} content={outputselect}/>
          			</Cells>
          		   </div>
          
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

export default composeNode(Node, 'function', 
                            {
                                category: 'processors',    
                                color: '#002255',
                                
                                defaults: {             
                                    name: {value:""},
									func: {value:"return msg;"},
									outputs: {value:1},
									noerr: {value:0,required:true,validate:function(v){ return ((!v) || (v === 0)) ? true : false; }}
                                },
                                
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-code",    
                                unicode: '\uf121',    
                                label: function() {     
                                    return this.name||this.topic||"function";
                                },
                                
                                description: ()=> "<p>A function block where you can write code to do more interesting things.</p> <p>The message is passed in as a JavaScript object called <code>msg</code>.</p> <p>By convention it will have a <code>msg.payload</code> property containing the body of the message.</p><h4>Sending messages</h4><p>The function can either return the messages it wants to pass on to the next nodes in the flow, or can call <code>node.send(messages)</code>.</p><p>It can return/send:</p><ul><li>a single message object - passed to nodes connected to the first output</li><li>an array of message objects - passed to nodes connected to the corresponding outputs</li></ul><p>If any element of the array is itself an array of messages, multiple messages are sent to the corresponding output.</p><p>If null is returned, either by itself or as an element of the array, no message is passed on.</p>",
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
