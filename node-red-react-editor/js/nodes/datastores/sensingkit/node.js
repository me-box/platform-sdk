import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Textarea from '../../../components/form/Textarea';
import Select from '../../../components/form/Select';
import Cell from '../../../components/Cell';
import Cells from '../../../components/Cells';
import '../../../../style/sass/code.scss';

class Node extends React.Component {

       render() {
       		
         	const nameprops = {	
								value: 	this.props.values.name || "",
				 				id: "name",
								onChange:(property, event)=>{
                  					 this.props.updateNode(property, event.target.value);
              					}
							}
							
        	const nameinput = <div className="centered">
							<Textfield {...nameprops}/>												
						  </div>

		  	const descriptionprops = {	
									value: 	this.props.values.description || "",
				 					id: "description",
									onChange:(property, event)=>{
                  						 this.props.updateNode(property, event.target.value);
              						}
								 }
			
			
		  	const descriptioninput 	= <Textarea {...descriptionprops}/>		
		
			
			
			
          
          return <div>
          			<Cells>									
						        <Cell title={"name"} content={nameinput}/>
						        <Cell title={"description"} content={descriptioninput}/>
          			</Cells>
          		 </div>
          
       }
}

export default composeNode(Node, 'sensingkit', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   //  along with default values.
           							            description: {value:""},
            						            type: {value:"sensingkit"},
                                },
                                
                                schema: {
                                	value: {type:'numeric'},
                                	ts:  {type:'time'},
                                },
                                
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-android",
                                unicode: '\uf17b',     
                                label: function() {     
                                    return this.name||"sensingkit";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                },
                                description: "<p>Android mobile sensingkit<code>{}</code></p>",


                            }
                          );
