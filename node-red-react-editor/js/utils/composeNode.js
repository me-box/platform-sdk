import React, {PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import {nodeCancelClicked} from '../actions/NodeMouseActions';
import { connect } from 'react-redux';
import Dialogue from '../components/Dialogue';

export default function composeNode(Component, nt, config){

  class Node extends React.Component {

       constructor(props){
           
           super(props);
           
           Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              {nodeCancelClicked: bindActionCreators(nodeCancelClicked, props.dispatch)}
           );
       }

       componentDidMount(){
          this.registerType(nt, config);
       }
       
       render() {
           // here you can pass down whatever you want 'inherited' by the child
           const {selected, dispatch} = this.props;
    
           const dialogueprops = {
              cancel: this.nodeCancelClicked,
              key: nt,
           }
          
           const componentprops = {
              register: this.props.register, 
              dispatch: dispatch,
           }

           if (selected && selected.type === nt){
              return <Dialogue {...dialogueprops}>
                        <Component  {...componentprops}/>
                    </Dialogue>
           }

           return null;
       }

  }

  Node.PropTypes = {
    register: React.PropTypes.func, 
    dispatch: React.PropTypes.func,
    store: React.PropTypes.object,
  }

  

  function select(state) {
      return {
        selected: state.nodes.selected,
      //and need some details here!
      }
  }

  return connect(select)(Node)
}