// @flow

import { createStructuredSelector } from 'reselect';

const SET_RULE= 'rules/rules/SET_RULE';

// This will be used in our root reducer and selectors
export const NAME = 'rules';

const initialState = {
    rules: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case SET_RULE:
      return state;
    
    default:
      return state;
  }
}


// Action creators


function setRule(id, rule){
  return {
    id,
    type: SET_RULE,
    rule
  }
}

// Selectors
const rules = (state) => state;

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
)
  

const pathsfor =(schema, path=[])=>{
    if (schema.type !== "object"){
        return [{path, type:schema.type}]
    }
    return Object.keys(schema.properties).map(k=>flatten(pathsfor(schema.properties[k],[...path, k])))
}

const  paths = (state, newProps)=>{
   
    const links = state.ports.links.reduce((acc, link)=>{
        const [port, from, to] = link.split(":");
        if (to===newProps.id){
            const node = state.nodes.nodesById[from];
            return [...acc, 
                {
                    id:node.id,
                    name:node.name||node.type, 
                    paths: flatten(pathsfor((node.schema || {}).output || {}))
                }
            ];
        }
        return acc;
    },[]);

    return links;
}

const outputtypes = (state, newProps)=>{
    const links = state.ports.links.reduce((acc, link)=>{
        const [port, from, to] = link.split(":");
        if (from===newProps.id){
            const node = state.nodes.nodesById[to];
            return [...acc, 
                {
                    id:node.id,
                    name:node.name||node.type, 
                    schema: (node.schema || {}).input || {},
                }
            ];
        }
        return acc;
    },[]);

    return links;
}

export const selector = createStructuredSelector({
    rules,
    paths,
    outputtypes,
});

export const actionCreators = {
  setRule
};