// @flow

import { createStructuredSelector } from 'reselect';

const CREATE_RULE= 'rules/rules/CREATE_RULE';
const UPDATE_RULE= 'rules/rules/UPDATE_RULE';

// This will be used in our root reducer and selectors
export const NAME = 'rules';

const initialState = {
    rules: [{}],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case CREATE_RULE:
        return {
          ...state,
          rules: [...state.rules,{}],
      }

    case UPDATE_RULE:
       return   { 
            ...state,
            rules: state.rules.map((r,i)=>{
                if (i==action.rule.ruleId){
                     return action.rule;
                }
                return r;
            })
        }

    default:
      return state;
  }
}


// Action creators


function createRule(id){
  return {
    id,
    type: CREATE_RULE,
  }
}

function updateRule(id,rule){
    return {
        id,
        type: UPDATE_RULE,
        rule,
    }
}

// Selectors
const rules = (state, newProps) => {
    if (newProps.id){
        return (state[newProps.id].rules || {}).rules ||[];
    }
    return [];
}
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
  updateRule,
  createRule,
};