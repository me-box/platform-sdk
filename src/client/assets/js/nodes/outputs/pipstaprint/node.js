import React from 'react';
//import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Textarea from 'components/form/Textarea';
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
          
          	return 	<div>
						<Cells>	
							<Cell title={"name"} content={nameinput}/>
							<Cell title={"message"} content={messageinput}/>
						</Cells>
					</div>	
          
       }
}
/*
export default composeNode(Node, 'pipstaprint', 
                            {
                                category: 'outputs',    
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},
                                    message: {value:""},
                                    subtype: {value:"printer"},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-print",    
                                unicode: '\uf02f',    
                                label: function() {     
                                    return this.name||this.topic||"pipstaprint";
                                },
                                
                                schema: (subtype)=>{
                                	return {
                                		input:{
											type:"object",
											description: "container object",
											properties:{
												payload: {type:'string',  description: 'the message you want to print'},
											},
											required: ["payload"]
										} 
                                	};
                                },
                                
                                description: ()=>"<p> This will send some text to a pico printer </p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );*/
