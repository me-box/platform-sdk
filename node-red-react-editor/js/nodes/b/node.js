import React from 'react';
import composeNode from '../../utils/composeNode';

class Node extends React.Component {

       render() {
          const {selected} = this.props;
          return  <h1> It is me ${selected.id} </h1>
          
       }
}

export default composeNode(Node, 'sample', 
                            {
                                category: 'input',      
                                color: '#a6bbcf',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:1,               
                                outputs:1,             
                               
                                icon: "debug.png",     
                                label: function() {     
                                    return this.name||this.topic||"sample";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );