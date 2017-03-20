import React from 'react';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Select from 'components/form/Select';

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
		
		  const nameinput = <div className="centered">
								<Textfield {...nameprops}/>												
						  	</div>
						  	
          const typeprops = {
				options: [
					                {name: 'twitter timeline', value: 'twitterUserTimeLine'},
					                {name: 'twitter stream', value: 'twitterHashTagStream'},
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
						  
          return  <div>
          			<Cells>	
          				<Cell title={"name"} content={nameinput}/>
          				<Cell title={"type"} content={typeinput}/>
          			</Cells>
            	  </div>
          
       }
}

export default composeNode(Node, 'twitter', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                
                                defaults: {             
                                    name: {value:""},   
                                    subtype: {value:"twitterHashTagStream"},
                                },
                                inputs:0,               
                                outputs:1,             
                                
                                schema: (subtype)=>{
                                
                        			const type = subtype || "twitterHashTagStream";
                        			
                        			const _descriptions = {
                        				twitterHashTagStream: "a twitter hash tag stream",
                        				twitterUserTimeLine: "a twitter user timeline",
                        			}
                        			        			
                        			return	{
                                		output:{
                                			msg: {
                                				type: "object",
                                				description: "the container object",
                                				properties:{
													name: {type:'string', description: "a name assigned to this twitter node"}, 
													id:  {type:'string', description: "<i>[id]</i>"},
													type:{type: 'string', description: "<i>twitter</i>"},
													subtype: {type: 'string', description: `<i>${type}</i>`},
											
													payload: {
														type: 'object', 
														description: 'the payload object', 
														properties: {
															ts: {type:'time', description: 'a unix timestamp'},
															value: {type:'string',  description: "a tweet"},    					
														},
														required: ["ts", "value"]
													}
												},
												required: ["id", "type", "subtype", "payload"]
											}	
                                		}
                                	}
                                },
                                
                                icon: "fa-twitter",
                                unicode: '\uf099',     
                                label: function() {     
                                    return this.name||"twitter";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: ()=>"<p>Latest tweets from a twitter account</p>",

                            }
                          );