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

export default composeNode2(Node, 'sentiment', {
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