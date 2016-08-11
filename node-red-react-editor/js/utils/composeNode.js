import React, {PropTypes} from 'react';
import Dialogue from '../components/Dialogue';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import * as DialogueActions  from '../actions/DialogueActions';
import {updateNode, updateNodeValueKey, incrementNodeValueKey} from '../actions/NodeActions';

export default function composeNode(Component, nt, config, reducer=null){

	class Node extends React.Component{
		
		static defaultProps = {
      		values: {}
  		}

		constructor(props){
			super(props);
			Object.assign(  this, 
              ...bindActionCreators(RegisterActions, props.dispatch), 
              ...bindActionCreators(DialogueActions, props.dispatch),
           	);	
		}

		/*
		* This is called once, when the node is loaded to the palette
		*/
	
		componentDidMount(){
          //this.registerType(nt, config, reducer);
       	}
		

		render(){

		   const {configuring, dispatch} = this.props;
    	   
    	   const props = Object.assign({}, this.props,  {
    	   		updateNode: bindActionCreators(updateNode, this.props.dispatch),
    	   		updateNodeValueKey: bindActionCreators(updateNodeValueKey, this.props.dispatch),
    	   		incrementNodeValueKey: bindActionCreators(incrementNodeValueKey, this.props.dispatch),
    	   })

           const dialogueprops = {
              cancel: this.cancel,
              ok: this.ok,
              title: configuring ? configuring.id : "",
           }
          
           if (configuring && configuring.type === nt){
				return <Dialogue {...dialogueprops}>
							<Component {...props} />
						</Dialogue>
			}
			return null;
		}
	}

	function select(state) {
		
	
		let stateobj = {
			selected: state.nodes.selected,
			configuring: state.nodes.configuring,
        	values: state.nodes.editingbuffer,
		}
      	if (reducer){
      		stateobj.local = state.nodes.selected ? state[state.nodes.selected.id] : null;
      	}
      	
      	if (state.nodes.selected){
      		stateobj.inputs =  state.ports.links.filter((link)=>{ 
        		return link.target.id === state.nodes.selected.id;
        	}).map((link)=>{
        		return link.source;
        	})
      	}
        return stateobj;
    }

    Node.PropTypes = {
    	register: React.PropTypes.func, 
    	dispatch: React.PropTypes.func,
    	store: React.PropTypes.object,
	}

	return {
		type: 		nt,
		def: 		Object.assign({_: (id)=>{return id}}, config), //TODO: find out what this '_' identity function is for
		reducer: 	reducer,
		node: 		connect(select)(Node),
	}
}