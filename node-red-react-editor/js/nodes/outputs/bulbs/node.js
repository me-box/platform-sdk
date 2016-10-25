import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import { formatSchema } from '../../../utils/utils';

class Node extends React.Component {
	
	componentDidMount(){
	  	 	if (this.props.values.subtype){
	   			this.props.updateOutputSchema(this.props.values.subtype);
	   		}
	}
	   	   	
	   	
    render() {
       
    
         const {selected,values,updateNode} = this.props;
          
         const nameprops = {
              id: "name",
              value: 	this.props.values.name || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }
          
          const typeprops = {
				options: [
									{name: 'on', value: 'set-bulb-on'},
					                {name: 'hue', value: 'set-bulb-hue'},
					                {name: 'brightness', value: 'set-bulb-bri'},
					     ],
					     
				onSelect: (event)=>{
					this.props.updateNode("subtype", event.target.value);
				},
				
				style: {width: '100%'},
				value: this.props.values.subtype || "",
		  }
			
			
          const valueprops = {
              id: "value",
              value: 	this.props.values.value || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }
          			  
		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
		
		  const typeinput = <div className="centered">
							<Select {...typeprops}/>												
						  </div>
		  
		  const valueinput = <div className="centered">
							<Textfield {...valueprops}/>													
						  </div>
						  
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"type"} content={typeinput}/>
          				<Cell title={"value"} content={valueinput}/>
          			</Cells>
            	  </div>	
          
    }
}

export default composeNode(Node, 'bulbsout', 
                            {
                                category: 'outputs',    
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"set-bulb-on"},
                                    value: {value:""},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-lightbulb-o",
                                unicode: '\uf0eb',     
                                label: function() {     
                                    return this.name||this.topic||"bulbsout";
                                },
                                
                                schema: (subtype)=>{
                                
                                	const type = subtype || "bulb-on";
                                
                                	const _descriptions = [		
                                							{
                                								type: "set-bulb-on", 
                                								schema: {
                                									payload: {
																		type: "string",
																		description: "<i>on</i> or <i>off</i>",
																	}
																}
															},
															{
                                								type: "set-bulb-hue", 
                                								schema: {
                                									payload: {
																		type: "numeric",
																		description: "a hue value (0-65000)",
																	}
																}
															},
															{
                                								type: "set-bulb-bri", 
                                								schema: {
                                									payload: {
																		type: "numeric",
																		description: "a brightness value (0-255)",
																	}
																}
															},
																			
									];
                                									
                                	const subschema = _descriptions.map((item)=>{
                                		return `	<div>
														<div class="flexrow">
															<div class="title">
																<div class="centered">
																	${item.type}
																</div>
															</div>
															<div>
																<div class="flexcolumn">
																${formatSchema(item.schema)}
																</div>
															</div>
														</div>
													</div>
												`
                                	}).join("");
                                	
                                	return {
										input:{
											type: 	{type:'string', description: "one of either \'set-bulb-on\', \'set-bulb-hue\', \'set-bulb-brightness\'"},
                                			payload: {	type:'one of', description: `<div class="flexcolumn">${subschema}</div>`},
                                		}
									}
                                },
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                 description: ()=>"<p> turn bulbs on or off, change their hue or brightness </p>",
                            }
                          );