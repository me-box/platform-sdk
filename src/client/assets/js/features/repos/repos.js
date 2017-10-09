import { createStructuredSelector } from 'reselect';
import {actionConstants as nodeActionTypes} from './constants';
export const NAME = 'repos';

const sha = (state={}, action)=>{
	return Object.assign({}, state, {...action.sha});
}

const _gitify = (name)=>{
	return name.replace(/\s/g, "-");
}

const initialState = {
	loaded: {name:"", sha:{}}, 
	browsingname:"", 
	currentuser:"", 
	tosave : {
		name: "", 
		commit: "", 
		description: ""
	}, 
	savedialogue: false,
	saveasdialogue: false,
	repos:[],
	visible:false,
	examples: [],
}

const FOREIGN_MOUSE_UP =  'iot.red/mouse/MOUSE_UP';
const FOREIGN_CLEAR = 'iot.red/editor/CLEAR';

export default function reducer(state = initialState, action) {
  	switch (action.type) {
	  
	  case nodeActionTypes.REPO_SHA_RETRIEVED:
	  	if (action.sha){
	  		return Object.assign({}, state, {
	  					loaded: Object.assign({}, state.loaded, {name:action.repo, sha: sha(state.loaded.sha, action)})
	  				});
	  	}else{
	  		return Object.assign({}, state, {
	  					loaded: Object.assign({}, state.loaded, {name:action.repo, sha:{}})
	  		});
	  	}
	  
	  //handles changes to the browsing textfield
	  case nodeActionTypes.REPO_BROWSINGNAME_CHANGED:
	  	return Object.assign({}, state, {browsingname:action.name});
	  
	  //records the (succsssfully) selected user whose repos we are browsing
	  case nodeActionTypes.REPO_CURRENTUSER_CHANGED:
	  	return Object.assign({}, state, {
	  										currentuser:action.name,
	  										browsingname: action.name,
	  									});
	  		
	  case nodeActionTypes.REPO_NAME_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {name:_gitify(action.name)})
	  				}
	  	);
	  
	  case nodeActionTypes.REPO_COMMIT_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {commit:action.commit})
	  				}
	  	);
	  	
	  case nodeActionTypes.REPO_DESCRIPTION_CHANGED:
	  	return Object.assign({}, state, {
	  					tosave: Object.assign({}, state.tosave, {description:action.description})
	  				}
	  	);

	  case nodeActionTypes.RECEIVE_EXAMPLES:
			return {
                ...state, 
                examples:action.repos
      		}

	  case nodeActionTypes.REPO_LIST_RETRIEVED:
	  	return Object.assign({}, state, {
	  		repos: action.repos || [],
	  		currentuser: action.username,
	  	});
	  
	  case nodeActionTypes.TOGGLE_SAVE_DIALOGUE:
			return Object.assign({}, state, {
				savedialogue: !state.savedialogue,
			});

	  case nodeActionTypes.TOGGLE_SAVE_AS_DIALOGUE:
			return Object.assign({}, state, {
				saveasdialogue: !state.saveasdialogue,
			});

	  case  nodeActionTypes.TOGGLE_VISIBLE:
	    	return Object.assign({}, state, {
	    		visible:!state.visible,
	    	});
	  
	  case  FOREIGN_MOUSE_UP:
	    	return Object.assign({}, state, {
	    		visible:false,
	    	});

	  case FOREIGN_CLEAR:
	  		return {
	  					...state,
	  					loaded: {name:"", sha:{}},
	  					tosave : {
							name: "", 
							commit: "", 
							description: ""
						}
					} 

	  default:

	    return state;
	}
}


const repos = (state) => state[NAME];

export const selector = createStructuredSelector({
  repos
});

