import React, {PropTypes} from 'react';
import NodeEditor from '../components/NodeEditor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as RegisterActions from '../actions/RegisterActions';
import * as DialogueActions  from '../actions/DialogueActions';
import * as HelpActions from '../actions/HelpActions';

import {updateNode, updateNodeValueKey, incrementNodeValueKey, initNodeKeys} from '../actions/NodeActions';
import {PALETTE_WIDTH, TOOLBAR_HEIGHT, TAB_HEIGHT, WORKSPACE_FOOTER} from '../constants/ViewConstants';

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
              ...bindActionCreators(HelpActions, props.dispatch), 
           	);	
            this.initNodeKeys = bindActionCreators(initNodeKeys, this.props.dispatch);
		}

		/*
		* This is called once, when the node is loaded to the palette
		*/
	
		componentDidMount(){
			
          //this.registerType(nt, config, reducer);
       	}
		

		render(){

		   const {configuring, selected, help, dimensions, dispatch, store} = this.props;
    	   
    	   const props = Object.assign({}, this.props,  {
    	   		width: dimensions.w - PALETTE_WIDTH,
    	   		updateNode: bindActionCreators(updateNode, this.props.dispatch),
    	   		updateNodeValueKey: bindActionCreators(updateNodeValueKey, this.props.dispatch),
    	   		incrementNodeValueKey: bindActionCreators(incrementNodeValueKey, this.props.dispatch),
    	   		updateDescription: (type)=>{
    	   			if (selected && selected._def){
    	   				this.updateDescription(selected.id, selected._def.description(type));
    	   			}
    	   		},
    	   		updateOutputSchema: (type)=>{
    	   			if (selected && selected._def){
    	   				this.updateOutputSchema(selected.id, selected._def.schema(type));
    	   			}
    	   		},
    	   })

           const nodeeditorprops = {
              cancel: this.cancel,
              ok: this.ok,
              title: configuring ? configuring.id : "",
              width: dimensions.w - PALETTE_WIDTH,
              height: dimensions.h - TOOLBAR_HEIGHT - WORKSPACE_FOOTER,
              top:  TOOLBAR_HEIGHT,
              left: PALETTE_WIDTH,
              node: selected,
              store,
              help,
           }
          
           
           if (configuring && configuring.type === nt){
				return <NodeEditor {...nodeeditorprops}>
							<Component {...props} />
						</NodeEditor>
			}
			return null;
		}
	}

	function select(state) {
		
	
		let stateobj = {
		    help: state.help,
			selected: state.nodes.selected,
			configuring: state.nodes.configuring,
        	values: state.nodes.editingbuffer,
        	dimensions: state.screen.dimensions,
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