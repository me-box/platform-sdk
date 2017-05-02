// @flow

import { createStructuredSelector } from 'reselect';
import {get} from 'utils/net'
import {generateId, calculateBounds, convertToJson} from '../../utils'

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SELECT_TEMPLATE  = 'uibuilder/palette/SELECT_TEMPLATE';
const FETCHING_TEMPLATES = 'uibuilder/palette/FETCHING_TEMPLATES';
const LOAD_TEMPLATE = 'uibuilder/palette/LOAD_TEMPLATE';
const LOAD_TEMPLATES = 'uibuilder/palette/LOAD_TEMPLATES';
// This will be used in our root reducer and selectors
export const NAME = 'uibuilder/templates';

// Define the initial state for `shapes` module

const initialState = {

  templates: [0, 1, 2, 3, 4, 5],

  templatesById: [
    {
      id: 0,
      type: 'circle',
      name: 'circle'
    },
    {
      id: 1,
      type: 'ellipse',
      name: 'ellipse'
    },
    {
      id: 2,
      type: 'rect',
      name: 'rect'
    },
    {
      id: 3,
      type: 'line',
      name: 'line'
    },
    {
      id: 4,
      type: 'text',
      name: 'text'
    },
    {
      id: 5,
      type: 'path',
      name: 'path'
    }
  ],

  selected: -1,

};



const _parseTemplate = function(template){
  const parser = new DOMParser();
  const doc = parser.parseFromString(template, "image/svg+xml");
  const root = doc.childNodes;

  let svg;

  for (var item of root) {
    if (item.nodeName === "svg" && item.childNodes.length > 0){
      svg = item;
      break;
    }
  }

  const items = convertToJson(svg.childNodes);
  return items;
}

export default function reducer(state=initialState, action = {}) {
  switch (action.type) {
    

    case SELECT_TEMPLATE: {
      return {
        ...state,
        selected: action.tid,
      };
    }

    case LOAD_TEMPLATES:{
        
        const ids = [];
        const newTemplatesByIds = action.templates.map((template, i)=>{
           
            ids.push(state.templates.length + i);
            return {
                id: state.templates.length + i,
                type: "group",
                name: template.image,
                children: _parseTemplate(template.body),
            }
        });


        
        return Object.assign({}, state, {
          templates: [...state.templates, ...ids],
          templatesById: [...state.templatesById, ...newTemplatesByIds],
        })  
    }

    case LOAD_TEMPLATE:{
      
      const template = _parseTemplate(action.template);
      return Object.assign({}, state, {
          templates: [...state.templates, state.templates.length],
          templatesById: [...state.templatesById, {
            id: state.templates.length,
            type: "group",
            children: template,
          }]

      })
    }

    default:
      return state;
  }
}

// Action Creators

function selectTemplate(id, tid: number) {
  return {
    id,
    type: SELECT_TEMPLATE,
    tid,
  };
}

function fetchingTemplates(id){
  return {
      id,
      type: FETCHING_TEMPLATES,
  }
}

function loadTemplate(id,template){
  return {
    id,
    type: LOAD_TEMPLATE,
    template
  }
}

function loadTemplates(id,templates){
  return {
    id,
    type: LOAD_TEMPLATES,
    templates
  }
}

function loadSVGTemplates(id){

  return (dispatch,getState)=>{
  
    dispatch(fetchingTemplates(id));

    get('/uibuilder/images/').then((res)=>{
      dispatch(loadTemplates(id, res.body));
    }).catch((err)=>{
      console.log("Seen a network error!!");
      throw err;
    });
  }
}

// Selectors

const templates = (state, newProps) => {
  
  return state[newProps.nid][NAME];
}

export const selector = createStructuredSelector({
  [NAME]:templates
});

export const actionCreators = {
  selectTemplate,
  loadSVGTemplates,
};