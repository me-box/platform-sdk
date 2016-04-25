import React from 'react';
import composeNode from '../../utils/composeNode';
import Textfield from '../../components/form/Textfield';

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

export default composeNode(Node, 'sentiment', 

          {
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
            },
);