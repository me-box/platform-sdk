import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';

class Node extends React.Component {

	  componentDidMount(){
	  	 	if (this.props.values.subtype){
	   			this.props.updateOutputSchema(this.props.values.subtype);
	   		}
	   }
	   
       render() {
       
       	  
         const nameprops = {
              id: "name",
              value: 	this.props.values.name || "",
			  
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
          }
          
          const typeprops = {
				options: [
					                {name: 'temp', value: 'temp'},
					                {name: 'humidity', value: 'humidity'},
					                {name: 'luminosity', value: 'luminosity'},
					                {name: 'movement', value:'movement'},
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

export default composeNode(Node, 'phidget', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"temp"},
                                },
                                inputs:0,               
                                outputs:1,             
                                
                                schema: (subtype)=>{
                        			
                        			const type = subtype || "temp";
                        			
                        			const _descriptions = {
                        				temp:  "temperature value (degrees centigrade)",
                                		humidity: "humidity value (%)",
                                		luminosity: "luminosity (lumens)",
                                		movement: "proximity value",
                        			}
                        			
                        			return	{
                                		output:{
                                			msg : {
                                				type: "object",
                                				description: "the container object",
                                				schema:{
													name: {type:'string', description: "a name assigned to this phidget"}, 
													id:  {type:'string', description: "the node id: [id]"},
													type:{type: 'string', description: "the type:\'phidget\'"},
													subtype: {type: 'string', description: `reading type:\'${type}\'`},
													payload: {
														type: 'object', 
														description: 'the payload object', 
														schema: {
															ts: {type:'time', description: 'a unix timestamp'},
															value: {type:'numeric', description: _descriptions[type] || ""},    					
														}
													}
												}
											}
                                		}
                                	}
                                },
                                
                                icon: "fa-cogs",
                                unicode: '\uf085',     
                                label: function() {     
                                    return this.name||"phidget";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: ()=>"<p>A bunch of  <a href=\"http://www.phidgets.com/\">phidget</a> sensors, recording luminosity, humidity, temperature and movement</p>",

                            }
                          );