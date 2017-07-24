import React from 'react';
//import composeNode from 'utils/composeNode';

class Node extends React.Component {

       render() {
          const {selected} = this.props;
          return  <h1> It is me ${selected.id} </h1>
          
       }
}

/*
export default composeNode(Node, 'datastore', 
                            {
                                category: 'outputs',      
                                color: '#d45500',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:1,               
                                outputs:0,             
                               
                                icon: "fa-mobile", 
                                unicode: '\uf10b',       
                                label: function() {     
                                    return this.name||this.topic||"datastore";
                                },
                                
                                description: "use this to create a new datastore",
                                
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );*/
