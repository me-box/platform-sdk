import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/github';

class Node extends React.Component {

       render() {
          
        	const {selected, inputs, help} = this.props;
            
       		
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
        	}
        	
        	const codeinput = <AceEditor {...aceprops}/> 
			
			
			
			const inputdescription = inputs.map((input, i)=>{
				const schema = help.outputschema[input.id] ?  help.outputschema[input.id] : input._def.schema ? input._def.schema() : {};
				
				const iconcontainer ={
					color:'white',
					background: input._def.color || '#ca2525',
					border: '2px solid white', 
					textAlign: 'center',
					boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)',
					color: 'white',
					height: '100%',
					justifyContent: 'center',
					display: 'flex'
				}
				
				const icon = {
					alignSelf: 'center',
				}
				
				const payload = Object.keys(schema).map((key)=>{
					const item = schema[key];
					return <div>
								<div className="flexrow">
								 	<div className="title">
								 		<div className="centered">
								 			<strong>{key}</strong>
								 		</div>
								 	</div>
								 	<div className="fixed" style={{width:100}}>
								 		<div className="centered">
								 		{item.type} 
								 		</div>
								 	</div>
								 	<div>
								 		<div className="centered">
								 		{item.description}
								 		</div>
								 	</div>
								</div>
						   </div>
				});
		
				return <div key={i} className="flexrow">
							
							<div className="fixed">
								<div style={iconcontainer}>
									<div style={icon}>
										<i className={`fa ${input._def.icon} fa-2x fa-fw`}></i>
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
			});
			
			const inputsoutputs = <div className="flexrow" style={{maxHeight:300, overflow:'auto'}}>	
										<div>
											<div className="flexcolumn">
												<div className="noborder" style={{background:'#445662', color: 'white'}}>
													<div className="centered" >
														there are {inputs.length} inputs to this function
													</div>
												</div>
												<div className="flexcolumn">
													<div className="noborder">
													{inputdescription}
													</div>
												</div>
											</div>
										</div>
										<div>
											<div className="flexcolumn">
												<div className="noborder" style={{background:'#445662', color: 'white'}}>
													<div className="centered" >
														there are 0 ouputs from this function
													</div>
												</div>
												<div className="flexcolumn">
													
												</div>
											</div>
										</div>
									</div>
								  				
          	return <div>
          			<Cells>		
          				<Cell content = {inputsoutputs} />							
						<Cell title={"name"} content={nameinput}/>
						<Cell title={"function"} content={codeinput}/>
						<Cell title={"outputs"} content={outputselect}/>
          			</Cells>
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
                                
                                description: ()=> "<p>A function block where you can write code to do more interesting things.</p> <p>The message is passed in as a JavaScript object called <code>msg</code>.</p> <p>By convention it will have a <code>msg.payload</code> property containing the body of the message.</p><h4>Logging and Error Handling</h4><p>To log any information, or report an error, the following functions are available:</p><ul><li><code>node.log('Log')</code></li><li><code>node.warn('Warning')</code></li><li><code>node.error('Error')</code></li></ul></p><p>The Catch node can also be used to handle errors. To invoke a Catch node, pass <code>msg</code> as a second argument to <code>node.error</code>:</p><pre>node.error('Error',msg)</pre><h4>Sending messages</h4><p>The function can either return the messages it wants to pass on to the next nodes in the flow, or can call <code>node.send(messages)</code>.</p><p>It can return/send:</p><ul><li>a single message object - passed to nodes connected to the first output</li><li>an array of message objects - passed to nodes connected to the corresponding outputs</li></ul><p>If any element of the array is itself an array of messages, multiple messages are sent to the corresponding output.</p><p>If null is returned, either by itself or as an element of the array, no message is passed on.</p><p>See the <a target='_new' href='http://nodered.org/docs/writing-functions.html'>online documentation</a> for more help.</p>",
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
