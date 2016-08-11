import React from 'react';
import composeNode from '../../../utils/composeNode';

class Node extends React.Component {

       render() {
          const {selected} = this.props;
          return  <h1> It is me ${selected.id} </h1>
          
       }
}

export default composeNode(Node, 'fmcgs', 
                            {
                                category: 'datastores',      
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-barcode",   
                                unicode: '\uf02a',     
                                
                                schema: {
                                	id:    {type:'string'},
                                	timestamp: {type: 'time'},
                                	values: {type: "array", elements: {type: 'object', schema: {id: 'string', product: 'string'}}}
                                },
                                
                                label: function() {     
                                    return this.name||this.topic||"fmcgs";
                                },

                                description: "<p>FMCGs are 'Fast Moving Consumer Goods' and refer to any consumables (food, clothes, toys etc) that have been registered in a household.</P  <p> The data will be of the form <em>{timestamp, event, product, data}</em> where the product is a UPC code.</p>",
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );