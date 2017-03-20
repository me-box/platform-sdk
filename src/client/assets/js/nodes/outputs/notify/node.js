import React from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Textarea from 'components/form/Textarea';
import Select from 'components/form/Select';
import Cell from 'components/Cell';
import Cells from 'components/Cells';

class Node extends React.Component {

       render() {
          	const {selected,values,updateNode} = this.props;
          
          	const nameprops = {
              id: "name",
              value: values.name || "",
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
              selected: selected,
          	}
          	
		  	const nameinput = <div className="centered">
						<Textfield {...nameprops}/>												
					</div>
          	
          	const messageprops = {
              id: "message",
              value: values.message || "",
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
              selected: selected,
          	}
          
          	const messageinput = <div className="centered">
						<Textarea {...messageprops}/>												
				  </div>
        	
        	
        	const toprops = {
              id: "to",
              value: values.to || "",
              onChange: (property, event)=>{
                  updateNode(property, event.target.value);
              },
              selected: selected,
          	}
          	
		  	const toinput = <div className="centered">
						<Textfield {...toprops}/>												
					</div>
        	
        	
        	const typeprops = {
        
				options: [{name: 'twitter', value: 'twitter'}, {name: 'sms', value: 'sms'}],
					     
				onSelect: (event)=>{
					this.props.updateNode("subtype", event.target.value);
					this.props.updateOutputSchema(event.target.value);
				},
				
				style: {width: '100%'},
				value: this.props.values.subtype || "",
			}
			
		 	const typeinput = <div className="centered">
		 					<Select {...typeprops}/>												
						  </div>
          
          	return  	 <div>
          						<Cells>	
          							<Cell title={"name"} content={nameinput}/>
          							<Cell title={"message"} content={messageinput}/>
          							<Cell title={"to"} content={toinput}/>
          							<Cell title={"type"} content={typeinput}/>
          						</Cells>
            	  			</div>
          
       }
}

export default composeNode(Node, 'notify', 
                            {
                                category: 'outputs',    
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"twitter"},
                                    message: {value:""},
                                    to:{value:""},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-envelope-o",    
                                unicode: '\uf003',    
                                label: function() {     
                                    return this.name||this.topic||"notify";
                                },
                                
                                schema: ()=>{
                                	return {
                                		input:{
                                			type: "object",
                                			description: "the container object",
                                			properties:{
												channel: {type:'string',  description: '<i>sms</i> or <i>twitter</i>', enum:["sms", "twitter"]},
												payload: {
														type: 'object', 
														description: 'the message payload', 
														properties: {
															to: {type:'string',  description: 'phone number or twitter handle'},
															message: {type:'string',  description: 'message to send'},
														},
														required: ["to", "message"] 
												}
											},
											required: ["channel", "payload"]
										}			
                                	}
                                },
                                
                                description: ()=>"<p> This will send a notification to a communication endpoint such as an email address, sms, twitter, growl or push.  Note that <strong> currently only twitter and sms are supported </strong></p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
