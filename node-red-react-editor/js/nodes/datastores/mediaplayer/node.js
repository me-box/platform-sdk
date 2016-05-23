import React from 'react';
import composeNode from '../../../utils/composeNode';

class Node extends React.Component {

       render() {
          const {selected} = this.props;
          return  <h1> It is me ${selected.id} </h1>
          
       }
}

export default composeNode(Node, 'media player', 
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
                                    return this.name||this.topic||"media player";
                                },
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );