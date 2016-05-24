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
                                color: '#ffcc00',
                                defaults: {             
                                    name: {value:""},   
                                    topic: {value:"", required:true}
                                },
                                inputs:0,               
                                outputs:1,             
                               
                                icon: "fa-film",
                                unicode: '\uf008',     
                                label: function() {     
                                    return this.name||this.topic||"media player";
                                },
                                description: "The media player datastore contains data from a household's media consumption.  Media events are stored in a tuple <em>{timestamp, event, programme}</em> where an event will be one of <em>{load, play, pause, exit, forward, rewind}</em> ",
                                labelStyle: function() { 
                                    return this.name?"node_label_italic":"";
                                }
                            }
                          );