import React, {PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../../actions/RegisterActions';
import {nodeCancelClicked} from '../../actions/NodeMouseActions';

//import Dialogue from '../../components/Dialogue';
import composeNode2 from '../../utils/composeNode2';

class Node extends React.Component {

       constructor(props){
           
           super(props);
           
           Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              {nodeCancelClicked: bindActionCreators(nodeCancelClicked, props.dispatch)}
           );
       }

       render() {
           // here you can pass down whatever you want 'inherited' by the child
          const {selected} = this.props 
          return  <h1> It is me ${selected.id} </h1>
          
       }

}

Node.PropTypes = {
    register: React.PropTypes.func, 
    dispatch: React.PropTypes.func,
    store: React.PropTypes.object,
}

export default composeNode2(Node, 'sample', {
      category: 'input',      // the palette category
      color: '#a6bbcf',
      defaults: {             // defines the editable properties of the node
          name: {value:""},   //  along with default values.
          topic: {value:"", required:true}
      },
      inputs:1,               // set the number of inputs - only 0 or 1
      outputs:1,              // set the number of outputs - 0 to n
      // set the icon (held in icons dir below where you save the node)
      icon: "debug.png",     // saved in  icons/myicon.png
      label: function() {     // sets the default label contents
          return this.name||this.topic||"sample";
      },
      labelStyle: function() { // sets the class to apply to the label
          return this.name?"node_label_italic":"";
      }
  });