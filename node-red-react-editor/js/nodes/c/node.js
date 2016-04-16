import React, {PropTypes } from 'react';
import composeNode from '../../utils/composeNode';

class Node extends React.Component {

       render() {
           // here you can pass down whatever you want 'inherited' by the child
          const {selected} = this.props 
          return  <h1> It is me ${selected.id} </h1>
          
       }

}

export default composeNode(Node, 'sentiment', {
                  category: 'analysis-function',
                  color:"#E6E0F8",
                  defaults: {
                      name: {value:""},
                  },
                  inputs:1,
                  outputs:1,
                  icon: "arrow-in.png",
                  label: function() {
                      return this.name||"sentiment";
                  },
                  labelStyle: function() {
                      return this.name?"node_label_italic":"";
                  }
            });