import React from 'react';
import { render } from 'react-dom';
import { REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE, NODE_DROPPED, NODE_UPDATE_VALUE, NODE_INIT_VALUES, NODE_UPDATE_VALUE_KEY, NODE_INCREMENT_VALUE_KEY} from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET} from '../constants/ViewConstants';
import fetch from 'isomorphic-fetch'
import {register} from '../store/configureStore';
import {scopeify} from '../utils/scopeify';
import {getID, addViewProperties} from '../utils/nodeUtils';
import config from '../config';

export function requestNodes() {
  return {
    type: REQUEST_NODES,
  }
}

export function requestCode(){
  return {
    type: REQUEST_CODE,
  }
}

export function dropNode(store, reducer, nt, def, x, y){
  	
  return function(dispatch, getState){
  	
  	
  	if ((x + MOUSE_X_OFFSET) > 0){
		let _def = Object.assign({},def);
	
	
		let node = {
			id: getID(),
			z:getState().tabs.current.id,
			type: nt,
			_def: _def,
			_: (id)=>{return id},
			inputs: _def.inputs || 0,
			outputs: _def.outputs,
			changed: true,
			selected: true,
			dirty: true,
			x: x + MOUSE_X_OFFSET,
			y: y + MOUSE_Y_OFFSET,
		}
		
		
		//so old nodes that are loaded won't necessarily have the new defaults!
		for (var d in node._def.defaults) {
		  if (node._def.defaults.hasOwnProperty(d)) {
			node[d] = node._def.defaults[d].value;
		  }
		}

		addViewProperties(node);
		
		//register this reducer and force nodeid to be passed in when state changes.  scopeify will ignore any actions that do not have this node's id as a parameter
		//this means that instances of the same node can trasparently make use of the same action constants without a clash!.
		if (reducer){
			register(store, node.id, scopeify(node.id, reducer));
		}
		dispatch(
			{
				type: NODE_DROPPED,
				node: node,
			}
		);
  	}else{
  		console.log("failed to drop node!");
  	}	
  }
}

export function initNodeKeys(keys){
  return {
    type: NODE_INIT_VALUES,
    keys
  }
}

export function updateNode(property, value){
  return {
    type: NODE_UPDATE_VALUE,
    property,
    value,
  }
}

export function updateNodeValueKey(property, key, value){

  return {
    type: NODE_UPDATE_VALUE_KEY,
    property,
    key,
    value,
  }
}

export function incrementNodeValueKey(property, key, amount, min, max){
  return {
    type: NODE_INCREMENT_VALUE_KEY,
    property,
    key,
    amount,
    min,
    max,
  }
}

export function receiveNodes(store, nodes) {

  return function(dispatch, getState){
    dispatch({
      type: RECEIVE_NODES,
      nodes,
      receivedAt: Date.now()
    })

    //dispatch(fetchFlows(store));
  }
}


//load up and regsiter all of the nodes that are in the file returned by fetchNodes
export function _loadNodes(json, store, dispatch){

   let toregister = [];

   json.nodes.forEach((node)=>{
    
      const n = require(`../nodes/${node.file}.js`);
    
      const elementprops = {
          dispatch: dispatch,
          store: store,
      }
      
      const element = React.createElement(n.default.node, {...elementprops});
     
      const g = document.createElement('div');
      g.id = node.name
     
      document.body.appendChild(g);
      toregister.push({name: n.default.type, def: n.default.def, reducer: n.default.reducer});
      render(element, document.getElementById(node.name));
      
   });    

   dispatch(receiveNodes(store, toregister));
}


//fetch the list of nodes that we want to load in the editor
export function fetchNodes(store) {

  return function (dispatch) {

    dispatch(requestNodes())

    return fetch(`http://${config.root}/nodes/nodes.json`,{
    	headers: {
        	'Accept': 'application/json',
        	'Content-Type': 'application/json',
      	},
      })
      .then(response => response.json())
      .then(function(json){
          _loadNodes(json, store, dispatch);
          return json;
      })
  }
}