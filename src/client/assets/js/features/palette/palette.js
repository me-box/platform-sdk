import { createStructuredSelector } from 'reselect';
import config from 'config';
import fetch from 'isomorphic-fetch'
import request from 'superagent'

const REQUEST_NODES  = 'iot.red/nodetypes/REQUEST_NODES';
const RECEIVE_NODES  = 'iot.red/nodetypes/RECEIVE_NODES';
const RECEIVE_CODE = 'iot.red/nodetypes/RECEIVE_CODE';
const LOAD_NODE =  'iot.red/nodetypes/LOAD_NODE';

export const NAME = 'palette';

const _categorise=(nodes)=>{
	const _nodes = nodes.reduce((acc, node) => {
		acc[node.def.category] = acc[node.def.category] || [];
		acc[node.def.category].push(node);
		return acc;
	},{});
  return _nodes;
}


const _injectScript = (src)=>{
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.addEventListener('load', resolve);
    script.addEventListener('error', () => reject('Error loading script.'));
    script.addEventListener('abort', () => reject('Script loading aborted.'));
    document.head.appendChild(script);
  });
}

const initialState = {
  isFetching:false, 
  didInvalidate: false, 
  types:[], 
  categories:{},
}

export default function reducer(state = initialState, action) {

  switch (action.type) {

  	case  REQUEST_NODES:
	    return Object.assign({}, state, {
        	isFetching: true,
        	didInvalidate: false
      	})
	  
    //called when all of the node types have been recieved!
    case RECEIVE_NODES:
      	return Object.assign({}, state, {
      		isFetching: false,
        	didInvalidate: false,
        	types: action.nodes,
        	categories: _categorise(action.nodes),
      	});
    
    case LOAD_NODE:

        const category = action.node.def.category || "unknown";
        const nodesbycategory = state.categories[category] || {};
        
        return {
          ...state,
          categories: {
            
            ...state.categories,

            [category]:  [...nodesbycategory,action.node],
            
          }
        }

	default:
	    return state;
  }
}




//load up all of the nodes that are in the file returned by fetchNodes
const loadNodes = (json)=>{

   const nodes = [];
   console.log("am in nodes");
   json.nodes.forEach((node)=>{

      const n = require(`../../nodes/${node.file}.js`);

      nodes.push({component:n.default.node, name: n.default.type, def: n.default.def, reducer: n.default.reducer});
    
   });    
  
   return nodes;
}




//fetch the list of nodes that we want to load in the editor
function fetchNodes(store) {

  return function (dispatch, getState) {

    dispatch(requestNodes())

    return fetch(`${config.root}/nodes/nodes.json`,{
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(function(json){
          const nodes = loadNodes(json);
          dispatch(receiveNodes(nodes));
      })


  }
}


function requestNodes() {
  return {
    type: REQUEST_NODES,
  }
}

function receiveNodes(nodes) {

  return function(dispatch, getState){
    dispatch({
      type: RECEIVE_NODES,
      nodes,
      receivedAt: Date.now()
    })
  }
}

function requestCode(){


  return function (dispatch, getState) {

    _injectScript(`${config.root}/lib/testbulb.js`)
    .then(() => {
       
        dispatch({
          type: LOAD_NODE,
          node:{component:testbulb.node, name: testbulb.type, def: testbulb.def, reducer:testbulb.reducer},
        })
    }).catch(error => {
        console.log(error);
    });

  }
}

const palette = (state) => state[NAME];

export const selector = createStructuredSelector({
  palette
});

export const actionCreators = {
  fetchNodes, 
  requestCode,
};
