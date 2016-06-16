import React from 'react';
import { render } from 'react-dom';
import { REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE, NODE_DROPPED, NODE_UPDATE_VALUE, NODE_INIT_VALUES, NODE_UPDATE_VALUE_KEY, NODE_INCREMENT_VALUE_KEY} from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET} from '../constants/ViewConstants';
//import {fetchFlows} from './FlowActions';
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
  
  let _def = Object.assign({},def);

  let node = {
    id: getID(),
    z:1,
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
  return {
    type: NODE_DROPPED,
    node: node,
  }
}

export function selectNode(node){
  return {
    type: NODE_SELECTED,
    node,
  }
}

/*export function initNodeValue(property, value){

  return {
    type: NODE_INIT_VALUES,
    property,
    value,
  }
}*/

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
     console.log("required");
     console.log(n);
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

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestNodes())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

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