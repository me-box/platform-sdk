import React from 'react';
import composeNode from '../../../utils/composeNode';

class Node extends React.Component {

       render() {
          const {selected} = this.props;
          return  <h1> It is me ${selected.id} </h1>
          
       }
}

export default composeNode(Node, 'listify', 
                            {
                                category: 'processors',    
                                color: '#002255',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "fa-code",    
                                unicode: '\uf121',    
                                label: function() {     
                                    return this.name||this.topic||"listify";
                                },
                                
                                description: "<p> This node will take in datastore data of the form <code> values:[{object}, {object}] </code> and convert it to <code> {keys:Array, rows: Array[]} </code> which is the form expected for the list view of the companion app </p>",
                                 
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );
