import {REPO_NAME_CHANGED, REPO_COMMIT_CHANGED,  REPO_DESCRIPTION_CHANGED, REPO_SAVE_PRESSED, REPO_LIST_RETRIEVED} from '../constants/ActionTypes';

export default function repos(state = { current : {name: "", commit: "", description: "", sha:""}, saved:[]}, action) {
  	switch (action.type) {
	  
	  case REPO_NAME_CHANGED:
	  	return Object.assign({}, state, {
	  					current: Object.assign({}, state.current, {name:action.name})
	  				}
	  	);
	  
	  case REPO_COMMIT_CHANGED:
	  	return Object.assign({}, state, {
	  					current: Object.assign({}, state.current, {commit:action.commit})
	  				}
	  	);
	  	
	  case REPO_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {
	  					current: Object.assign({}, state.current, {description:action.description})
	  				}
	  	);

	  case REPO_LIST_RETRIEVED:
	  	return Object.assign({}, state, {
	  		saved: action.repos,
	  	});
	  	
	  default:
	    return state;
	}
}