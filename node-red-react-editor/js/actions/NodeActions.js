import React from 'react';
import { render } from 'react-dom';

import { REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE, NODE_DROPPED } from '../constants/ActionTypes';
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
    x: x-180,
    y: y- 35,
  }
}

export function selectNode(node){
  return {
    type: NODE_SELECTED,
    node,
  }
}

export function receiveNodes(json) {

  require.ensure(["../nodes/b/b"], function(require){
    var BNode = require('../nodes/b/b');
    
    //export function injectAsyncReducer(store, name, asyncReducer) {
     // store.asyncReducers[name] = asyncReducer;
      //store.replaceReducer(createReducer(store.asyncReducers));
    //}

    //perhaps pass in the store here and have the element do what it needs to do to register its reducer?
    let element = React.createElement(BNode.default, {data:'tom'});
 
    render(element,  document.getElementById('additional'));
  });

  return {
    type: RECEIVE_NODES,
    nodes: json,
    receivedAt: Date.now()
  }
}


export function fetchComponent(store){

    return function(dispatch){
     
      require.ensure(["../nodes/b/b"], function(require){
          var BNode = require('../nodes/b/b');
        

          let elementprops = {
              register: register.bind(this, store),
              dispatch: dispatch,
          }
      
          let element = React.createElement(BNode.default, {...elementprops});
          render(element,  document.getElementById('additional'));
      });
    }
}

export function fetchNodes() {

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

    return fetch(`http://localhost:1880/nodes`,{
    	headers: {
        	'Accept': 'application/json',
        	'Content-Type': 'application/json',
      	},
      })
      .then(response => response.json())
      .then(json =>dispatch(receiveNodes(json)))

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}