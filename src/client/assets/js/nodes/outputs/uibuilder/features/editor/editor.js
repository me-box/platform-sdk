// @flow

import { createStructuredSelector } from 'reselect';
//import { State } from 'models/editor';
import {post, get} from 'utils/net';

//import {actionCreators as mapperActions} from 'features/mapper';
//import {actionCreators as templateActions} from 'features/canvas';
//import {actionCreators as liveActions} from 'features/live';
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SCREEN_RESIZE  = 'uibuilder/editor/SCREEN_RESIZE';
const SET_VIEW  = 'uibuilder/editor/SET_VIEW';
const SAVING = 'uibuilder/editor/SAVING';
const LOADING = 'uibuilder/editor/LOADING';
const SET_SCENES = 'uibuilder/editor/SET_SCENES';

// This will be used in our root reducer and selectors

export const NAME = 'uibuilder/editor';

// Define the initial state for `shapes` module


const initialState = {
    w : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    ow: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    oh: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    view: "editor",
    scenes: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SCREEN_RESIZE: {
      return {
        ...state,
        w: action.w,
        h: action.h,
      };
    }

    case SET_VIEW:
      return Object.assign({}, state, {view:action.view})
    
    case SET_SCENES:
      return Object.assign({}, state, {scenes:action.scenes})
    
    default:
      return state;
  }
}

// Action Creators

function screenResize(w: number, h:number) {
  return {
    type: SCREEN_RESIZE,
    w,
    h,
  };
}

function setView(view:string){
  return{
    type: SET_VIEW,
    view,
  }
}

function save(){
   return (dispatch, getState)=>{
       const {canvas : {templates, templatesById}, mapper: {mappings, transformers}} = getState();
      
       const state = JSON.stringify({
                                        templates, 
                                        templatesById,
                                        mappings, 
                                        transformers
                                    });

       post("scene/add", {name:"test", scene:state});

       dispatch({type:SAVING});
    }
}

function load(scene){
    return (dispatch, getState)=>{
       dispatch({type:LOADING});
       
       dispatch(liveActions.clearState());
       dispatch(templateActions.clearState());
       dispatch(mapperActions.clearState());

       get(`/scenes/${scene}`).then((data)=>{
          const scene = JSON.parse(data.text);
          dispatch(templateActions.loadTemplates({templates: scene.templates, templatesById:scene.templatesById}));
          dispatch(mapperActions.loadMappings({mappings: scene.mappings, transformers: scene.transformers}));
          
       });
    }
}

function setScenes(scenes){
  return {
    type: SET_SCENES,
    scenes: scenes,
  }
}

// Selectors
const editor = (state) => state;

export const selector = createStructuredSelector({
  [NAME] : (state, ownProps)=>{
      return state[ownProps.nid][NAME];
  }
});

export const actionCreators = {
  screenResize,
  setView,
  setScenes,
  save,
  load,
};