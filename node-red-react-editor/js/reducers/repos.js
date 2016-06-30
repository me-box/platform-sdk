import {REPO_NAME_CHANGED, REPO_COMMIT_CHANGED,  REPO_DESCRIPTION_CHANGED, REPO_SAVE_PRESSED, REPO_LIST_RETRIEVED, REPO_COMMIT_RETRIEVED} from '../constants/ActionTypes';

export default function repos(state = { loaded: {name:"", sha:""}, tosave : {name: "", commit: "", description: ""}, repos:[]}, action) {
  	switch (action.type) {
	  
	  case REPO_COMMIT_RETRIEVED:
	  	return Object.assign({}, state, {
	  					loaded: Object.assign({}, state.loaded, {...action.commit})
	  				}
	  	);
	  
	  case REPO_NAME_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {name:action.name})
	  				}
	  	);
	  
	  case REPO_COMMIT_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {commit:action.commit})
	  				}
	  	);
	  	
	  case REPO_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {description:action.description})
	  				}
	  	);

	  case REPO_LIST_RETRIEVED:
	  	return Object.assign({}, state, {
	  		repos: action.repos,
	  	});
	  	
	  default:
	    return state;
	}
}