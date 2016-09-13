import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';

class Node extends React.Component {

       render() {
       
          console.log("in here ereneding!");
         const nameprops = {
              id: "name",
              value: this.props.values,
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
              
          }

          return <div className="form-row">
             <Textfield {...nameprops}/>
          </div>
          
       }
}

export default composeNode(Node, 'bulbs', 
                            {
                                category: 'outputs',      
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-lightbulb-o",
                                unicode: '\uf0eb',     
                                label: function() {     
                                    return this.name||this.topic||"bulbs";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );