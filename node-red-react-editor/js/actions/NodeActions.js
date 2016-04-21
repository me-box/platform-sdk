import React from 'react';
import { render } from 'react-dom';
import { REGISTER_TYPE, REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE, NODE_DROPPED, NODE_CHANGED } from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET, NODE_HEIGHT, NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
import {calculateTextWidth} from '../utils/utils';
import fetch from 'isomorphic-fetch'
import {register} from '../store/configureStore';
import {scopeify} from '../utils/scopeify';

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
    id:(1+Math.random()*4294967295).toString(16),
    z:1,
    type: nt,
    _def: _def,
    _: (id)=>{return id},
    inputs: _def.inputs || 0,
    outputs: _def.outputs,
    changed: true,
    selected: true,
    dirty: true,
    h: Math.max(NODE_HEIGHT,(_def.outputs||0) * 15),
    x: x + MOUSE_X_OFFSET,
    y: y + MOUSE_Y_OFFSET,
  }

  //create label
  try {
        node.label  = (typeof _def.label  === "function" ? _def.label.bind(_def).call() : _def.label ) || _def.label ;
  } catch(err) {
       console.log(`Definition error: ${_def.type}.label`,err);
        node.label = nt;
  }

  node.w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(node.label, "node_label", 50)+(_def.inputs>0?7:0))/GRID_SIZE)));

  //create label style
  if (_def.labelStyle){
      try{
        node.labelStyle = (typeof _def.labelStyle === "function") ? _def.labelStyle.bind(_def).call() : _def.labelStyle || "";    
      }catch (err){
                console.log(`Definition error: ${d.type}.labelStyle`,err);
      }
  }
  
  for (var d in _def.defaults) {
      if (_def.defaults.hasOwnProperty(d)) {
          node[d] = _def.defaults[d].value;
      }
  }

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

export function changeNode(node, property, event, value){

  return {
    type: NODE_CHANGED,
    node,
    property,
    value: event.target.value,
  }
}

export function receiveNodes(json) {
  return {
    type: RECEIVE_NODES,
    nodes: json,
    receivedAt: Date.now()
  }
}


export function registerNodes(nodes){
  return{
    type: REGISTER_TYPE,
    nodes,
  }
}

export function fetchComponent(store){

    return function(dispatch){
     
      /*require.ensure(["../nodes/b/b"], function(require){
          var BNode = require('../nodes/b/b');
      
          let elementprops = {
              register: register.bind(this, store),
              dispatch: dispatch,
              store: store,
          }
      
          let element = React.createElement(BNode.default, {...elementprops});
          render(element,  document.getElementById('additional'));
      });*/
    }
}

export function loadNodes(json, store, dispatch){
  
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

   dispatch(registerNodes(toregister));
}

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

    return fetch(`http://localhost:8080/nodes/nodes.json`,{
    	headers: {
        	'Accept': 'application/json',
        	'Content-Type': 'application/json',
      	},
      })
      .then(response => response.json())
      .then(function(json){
          console.info("fetching nodes");
          loadNodes(json, store, dispatch);
          return json;
      }).then(function(json){
          dispatch(receiveNodes(json));
      });
    
      
      //.then(json =>dispatch(receiveNodes(json, store, dispatch)))

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}