import React from 'react';
import { render } from 'react-dom';

import { REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE, NODE_DROPPED } from '../constants/ActionTypes';
import { MOUSE_X_OFFSET, MOUSE_Y_OFFSET} from '../constants/ViewConstants';
import fetch from 'isomorphic-fetch'

/* bunch of stuff - needs to be in dynamic bit! */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CounterActions from '../actions/CounterActions';
import {register} from '../store/configureStore';


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

export function dropNode(nt, def, x, y){
  return {
    type: NODE_DROPPED,
    nt,
    def,
    x:x + MOUSE_X_OFFSET,
    y:y + MOUSE_Y_OFFSET,
  }
}

export function selectNode(node){
  return {
    type: NODE_SELECTED,
    node,
  }
}

export function receiveNodes(json) {
  console.log ("dispatching receievd nodes!");
  return {
    type: RECEIVE_NODES,
    nodes: json,
    receivedAt: Date.now()
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
   console.log("loading nodes!");
   console.log(json);

   json.nodes.forEach((node)=>{
      let n = require(`../nodes/${node.file}.js`);
      let elementprops = {
          register: register.bind(this, store),
          dispatch: dispatch,
          store: store,
      }

      console.log(n);
      console.log(`attaching to id ${node.name}`)
      
      let element = React.createElement(n.default, {...elementprops});
      
      //ids for the node need to be injected at into index.html!
      render(element,  document.getElementById(`${node.name}`));
      /*require.ensure([node], function(require){
            var BNode = require(node);
      
            let elementprops = {
              register: register.bind(this, store),
              dispatch: dispatch,
              store: store,
            }
      
            let element = React.createElement(BNode.default, {...elementprops});
            render(element,  document.getElementById('additional'));
      });*/
   });    
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
          console.log("-----> fetching again!! <-----------");
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