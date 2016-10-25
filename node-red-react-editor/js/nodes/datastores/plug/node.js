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
									{name: 'power', value: 'power'},
					                {name: 'voltage', value: 'voltage'},
					                {name: 'current', value: 'current'},
					                {name: 'on/off', value: 'power-state'},
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

export default composeNode(Node, 'plugin', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"power"},
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-plug",
                                unicode: '\uf1e6',     
                                label: function() {     
                                    return this.name||this.topic||"plugin";
                                },
                                
                                 schema: (subtype)=>{
                                	const type = subtype || "power";
                                	
                                	const payloads = {
                                		"power-state": {type: "string", description: "<i>on</i> or <i>off</i>"},
										"voltage": {type: "numeric", description: "voltage"},
										"current": {type: "numeric",description: "current (amps)"},
										"power": {type: "numeric",description: "power (watts)"}
                                	}
                                	
                                	return {
                                		output:{
                                				msg: {
                                					type: "object",
                                					description: "the container object",
                                					schema:{
														name: {type:'string', description: "a name assigned to this plug"}, 
														id:  {type:'string', description: "the node id: [id]"},
														type:{type: 'string', description: `the type:\'plugin\'`},
														subtype: {type: 'string', description: `reading type:\'${type}\'`},
														payload: {
															type: 'object', 
															description: 'the payload object', 
															schema: {
																ts: {type:'time', description: 'a unix timestamp'},
																value: payloads[type],					
															}
														}
													}
												}
										}			
									}	
                                },
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                 description: ()=>"<p> smart plug readings </p>",
                            }
                          );