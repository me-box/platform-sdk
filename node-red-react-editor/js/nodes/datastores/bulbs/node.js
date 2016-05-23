import React from 'react';
import composeNode from '../../../utils/composeNode';

class Node extends React.Component {

       render() {
         const nameprops = {
              name: "name",
              values: this.props.values,
              icon: this.props.icon,
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
              selected: this.props.selected,
          }

          return <div className="form-row">
             <Textfield {...nameprops}/>
          </div>
          
       }
}

export default composeNode(Node, 'bulbs', 
                            {
                                category: 'datastores',      
                                color: '#a6bbcf',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "debug.png",     
                                label: function() {     
                                    return this.name||this.topic||"bulbs";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );