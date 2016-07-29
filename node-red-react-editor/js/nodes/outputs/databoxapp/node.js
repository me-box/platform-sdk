import React from 'react';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';

class Node extends React.Component {

      
      render() {
         
         const nameprops = {

              name: "name",
             
              value: this.props.values['name'] || this.props.selected['name'] || "",
              
              icon: "fa fa-tasks",
             
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

export default composeNode(Node, 'app', 
                            {
                                category: 'outputs',      
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},
                                    appId: {value:"webapp"},
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-mobile", 
                                unicode: '\uf10b',       
                                label: function() {     
                                    return this.name||this.topic||"databox app";
                                },
                                
                                description: "<p>The databox app is the standard messaging endpoint for users in a household.</p>  The <code>msg.payload</code> must be formatted as a json object with values <p> <code>{ contenttype: [numeric, table, html], content: [your content]}</code></p> <p> Where there are multiple companion apps associated with a databox, the message will be sent to the owner or owners of the datastore(s) used in your flow </p>", 

                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );