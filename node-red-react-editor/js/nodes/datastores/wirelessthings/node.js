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
									{name: 'humidity', value: 'humidity'},
					                {name: 'tilt', value: 'tilt'},
					                {name: 'button1', value: 'button1'},
					                {name: 'button2', value: 'button2'},
					                {name: 'button3', value: 'button3'},
					                {name: 'button4', value: 'button4'},
					                {name: 'button5', value: 'button5'},
					                {name: 'temperature', value: 'temperature'},
					                {name: 'battery', value:'battery'},
					                {name: 'light', value:'light'},
					                
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

export default composeNode(Node, 'wirelessthings', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"humidity"},
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-wifi ",
                                unicode: '\uf1eb',     
                                label: function() {     
                                    return this.name||"wirelessthings";
                                },
                                
                                 schema: (subtype)=>{
                                	const type = subtype || "humidity";
                                	
                                	const payloads = {
                                		"humidity": {type: "number", description: "a humidity reading (%)"},
					                	"tilt": 	{type: "number", description: "a 0 or 1"},
					                	"button1":  {type: "number", description: "button1 on keypad pressed"},
					                	"button2":  {type: "number", description: "button2 on keypad pressed"},
					                	"button3":  {type: "number", description: "button3 on keypad pressed"},
					                	"button4":  {type: "number", description: "button4 on keypad pressed"},
					                	"button5":	{type: "number", description: "button5 on keypad pressed"},
					                	"temperature": {type: "number", description: "a temperature reading (degrees celsius)"},
					                	"battery": {type: "number", description: "a battery reading (voltage)"},
					                	"light":   {type: "number", description: "a light reading (lux)"},
                                	}
                                	
                                	return {
                                		output:{
                                				msg: {
                                					type: "object",
                                					description: "the container object",
                                					properties:{
														name: {type:'string', description: "a name assigned to this sensor"}, 
														id:  {type:'string', description: "the node id: [id]"},
														type:{type: 'string', description: `the type:\'wirelessthings\'`},
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
                                 description: ()=>"<p> wireless things sensors </p>",
                            }
                          );