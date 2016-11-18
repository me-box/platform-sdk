import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import {matchLibraries} from '../../../utils/utils';
import {codeFromSchema} from '../../../utils/codegen';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';

class Node extends React.Component {

	   constructor(props){
	   		super(props);
	   		this._createInputCode = this._createInputCode.bind(this);
	   		this._createOutputCode = this._createOutputCode.bind(this);
	   }
	   
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
        			console.log(brace);
        			 this.props.updateNode("func", value);
        		},
        		value: this.props.values.func || this.props.selected.func || "",
        		mode: "javascript",
        		theme: "github",
        		name: selected.id,
        		editorProps:{$blockScrolling: true},
        		height: '300px',
        		width: '100%',
        		showPrintMargin: false,
        	}
        	
        	const incode = inputs.map((node, i)=>{
        		
        		const iconstyle = {
					alignSelf: 'center',
					height: 40,
					width: 40,
					color:'white',
					background: node._def.color || '#ca2525',
					border: '2px solid white', 
					textAlign: 'center',
					boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
					marginTop: 5,
					paddingTop: 5,
					color: 'white',
					fontSize: 30,
				}
        		
        		return 	<div onClick={this._createInputCode.bind(null, node)} key={i} style={iconstyle}>
        					<i className={`fa ${node._def.icon} fa-fw`}></i>
        				</div>
        	});
        	
        	const outcode = outputs.map((node, i)=>{
        		
        		const iconstyle = {
					alignSelf: 'center',
					height: 40,
					width: 40,
					color:'white',
					background: node._def.color || '#ca2525',
					border: '2px solid white', 
					textAlign: 'center',
					boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
					marginTop: 5,
					paddingTop: 5,
					color: 'white',
					fontSize: 30,
				}
        		
        		return 	<div onClick={this._createOutputCode.bind(null, node)} key={i} style={iconstyle}>
        					<i className={`fa ${node._def.icon} fa-fw`}></i>
        				</div>
        	});
        	
        	const codeinput = <div className="flexrow">
        						<div style={{width:50, background:"#333", color:"white"}}>
        							<div className="flexcolumn">
										<div>
											<div className="centered">
												<div style={{color:"white", fontSize:14}}>in</div>
											</div>
										</div>
										{incode}
										<div>
											<div className="centered">
												<div style={{color:"white", fontSize:14}}>out</div>
											</div>
										</div>
										{outcode}
        							</div>
        						</div>
        						<AceEditor {...aceprops}/>
							  </div>		  				
          	return <div>
          			<Cells>				
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"external libraries"} content={libraries}/>
						<Cell title={"function"} content={codeinput}/>
						<Cell title={"outputs"} content={outputselect}/>
          			</Cells>
          		   </div>
          
       }
       
       _createInputCode(node){
       		const {help} = this.props;
       		const fullschema = help.outputschema[node.id] ?  help.outputschema[node.id].output : node._def.schema ? node._def.schema().output : {};
          	const code = codeFromSchema(fullschema, "input");
          	const func = `${code}\n${this.props.values.func || ""}`;
            this.props.updateNode("func", func);
       }
       
       _createOutputCode(node){
       		const {help} = this.props;
       		let schema;
       		
       		if (help.inputschema && help.inputschema[node.id]){
       			schema = help.inputschema[node.id].input;
       		}else{
       			schema = node._def.schema ? node._def.schema().input : {};
       		}
       	
       		const code = codeFromSchema(schema, "output");
       		const func = `${this.props.values.func || ""}\n${code}`;
            this.props.updateNode("func", func);
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
