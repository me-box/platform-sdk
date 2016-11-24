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
					                {name: '1 min load average', value: 'loadavg1'},
					                {name: '5 min load average', value: 'loadavg5'},
					                {name: '15 min load average', value: 'loadavg15'},
					                {name: 'free memory', value:'freemem'},
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

export default composeNode(Node, 'osmonitor', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                
                                defaults: {             
                                    name: {value:""},   
                                    type: {value:"osmonitor"},
                                    subtype: {value:"loadavg1"},
                                },
                                inputs:0,               
                                outputs:1,             
                                
                                schema: (subtype)=>{
                        			
                        			const type = subtype || "loadavg1";
                        			
                        			const _descriptions = {
                        				loadavg1: "a % value for the last minute system load",
                        				loadavg5: "a % value for the last 5 minutes system load",
                                		loadavg15: "a % value for the last 15 minutes system load",
                                		freemem: "free memory (bytes)",
                        			}
                        			
                        			
            
  
                                	return	{
                                		output:{
                                			msg: {
                                				type: "object",
                                				description: "the container object",
                                				properties:{
													name: {type:'string', description: "a name assigned to this monitor"}, 
													id:  {type:'string', description: "the node id: [id]"},
													type:{type: 'string', description: `the type:\'osmonitor\'`},
													subtype: {type: 'string', description: `reading type:\'${type}\'`},
													payload: {
														type: 'object', 
														description: 'the payload object', 
														properties: {
															ts: {type:'time', description: 'a unix timestamp'},
															value: {type:'number', description: _descriptions[type] || ""},    					
														},
														required: ["ts", "value"]
													},	
												},
												required: ["id", "type", "subtype", "payload"]
											}
                                		}
                                	}
                                },
                                
                                icon: "fa-terminal",
                                unicode: '\uf120',     
                                label: function() {     
                                    return this.name||"osmonitor";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: ()=>"<p>OS monitor of the databox, providing 1,5 and 15 minute load averages (percentages) and free memory (bytes)</p>",


                            }
                          );