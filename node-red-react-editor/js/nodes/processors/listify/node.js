import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';

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
          
          return <div className="flexcolumn">
          				<div>
          					<div className="flexrow">
								<div className="title">	
									<div className="centered">name</div>
								</div>
					
								<div>
									<div className="centered">
										<Textfield {...nameprops}/>
									</div>
								</div>
							</div>
						</div>
					</div>			
          
       }
}

export default composeNode(Node, 'listify', 
                            {
                                category: 'processors',    
                                color: '#002255',
                                defaults: {             
                                    name: {value:""},   
                                },
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-list",    
                                unicode: '\uf03a',    
                                label: function() {     
                                    return this.name||this.topic||"listify";
                                },
                                
                                description: ()=>"<p> This node will take in datastore data of the form <code> values:[{object}, {object}] </code> and convert it to <code> {keys:Array, rows: Array[]} </code> which is the form expected for the list view of the companion app </p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
