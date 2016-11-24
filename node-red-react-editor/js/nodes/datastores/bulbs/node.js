import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';

class Node extends React.Component {

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
									{name: 'on', value: 'bulb-on'},
					                {name: 'hue', value: 'bulb-hue'},
					                {name: 'brightness', value: 'bulb-bri'},
					     ],
					     
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

		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"type"} content={typeinput}/>
          			</Cells>
            	  </div>	
          
    }
}

export default composeNode(Node, 'bulbsin', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"bulb-on"},
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-lightbulb-o",
                                unicode: '\uf0eb',     
                                label: function() {     
                                    return this.name||this.topic||"bulbsin";
                                },
                                
                                 schema: (subtype)=>{
                                	const type = subtype || "bulb-on";
                                	
                                	const payloads = {
                                		"bulb-on": {type: "string", description: "<i>on</i> or <i>off</i>"},
										"bulb-hue": {type: "number", description: "a hue value (0-360)"},
										"bulb-bri": {type: "number",description: "a brightness value (0-255)"}
                                	}
                                	
                                	return {
                                		output:{
                                				msg: {
                                					type: "object",
                                					description: "the container object",
                                					properties:{
														name: {type:'string', description: "a name assigned to this bulb"}, 
														id:  {type:'string', description: "the node id: [id]"},
														type:{type: 'string', description: `the type:\'bulbs-in\'`},
														subtype: {type: 'string', description: `reading type:\'${type}\'`},
														payload: {
															type: 'object', 
															description: 'the payload object', 
															properties: {
																ts: {type:'time', description: 'a unix timestamp'},
																value: payloads[type],					
															},
															required: ["ts", "value"]
														}
													},
													required: ["id", "type", "subtype", "payload"]
												}
										}			
									}	
                                },
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                 description: ()=>"<p>  This node allows you to read the current status of the phillips hue bulbs (whether on or off, the hue and the brightness) </p>",
                            }
                          );