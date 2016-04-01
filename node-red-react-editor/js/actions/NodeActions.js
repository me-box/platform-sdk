import React from 'react';
import { render } from 'react-dom';

import { REQUEST_NODES, RECEIVE_NODES, REQUEST_CODE } from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch'

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

export function receiveNodes(json) {

  require.ensure(["../nodes/b"], function(require){
    var Node = require('../nodes/b');
    //console.log("node is");
    //console.log(Node);
    //console.log(document.getElementById('additional'))
    //console.log(React.createElement(Node));
    console.log(Node);
    render(React.createElement(Node.default),  document.getElementById('additional'));
  });

  return {
    type: RECEIVE_NODES,
    nodes: json,
    receivedAt: Date.now()
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