import React, {PropTypes} from 'react';
import Dialogue from '../components/Dialogue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import * as DialogueActions  from '../actions/DialogueActions';
import {changeNode} from '../actions/NodeActions';

export default function composeNode(Component, nt, config){

	class Node extends React.Component{
		
		constructor(props){
			super(props);
			Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              ...bindActionCreators(DialogueActions, props.dispatch),
           );
		}

	
		componentDidMount(){
          this.registerType(nt, config);
       	}
		

		render(){

		   const {selected, dispatch} = this.props;
    	   
    	   const props = Object.assign({}, this.props,  {
    	   		onChange: bindActionCreators(changeNode.bind(this, selected), this.props.dispatch),
    	   })

           const dialogueprops = {
              cancel: this.cancel,
              ok: this.ok,
              nt: nt,
              node: selected,
           }
           
           const componentprops = {
              register: this.props.register, 
              dispatch: dispatch,
           }
          
           if (selected && selected.type === nt){
				return <Dialogue {...dialogueprops}>
							<Component {...props} />
						</Dialogue>
			}
			return null;
		}
	}

	function select(state) {
      return {
        selected: state.nodes.selected,
        values: state.nodes.editingbuffer,
      //and need some details here!
    	}
    }

    Node.PropTypes = {
    	register: React.PropTypes.func, 
    	dispatch: React.PropTypes.func,
    	store: React.PropTypes.object,
	}

	return connect(select)(Node)
}