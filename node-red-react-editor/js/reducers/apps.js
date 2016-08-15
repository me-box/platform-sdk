import { APP_MESSAGE, RECEIVE_FLOWS, DEPLOY_SUCCESS, DEPLOY_ERROR, DEPLOYING_FLOWS } from '../constants/ActionTypes';


const addIfNew = (state, action) =>{
	switch (action.type){

		case APP_MESSAGE:
		
			//can make this more efficient if need 
			if (state.data.map(t=>{return t.id}).indexOf(action.id) !== -1){
				return state.data.map(t=>{
					if (t.id === action.id){
						t.name = action.name;
					}
					return t;
				});
			}
			return [...state.data, {id:action.id, name:action.name, view:action.view, data:[]}]

		default:
			return state;
	}
}

const app = (state, action) =>{
	switch (action.type){
		case APP_MESSAGE:

			if (state.id !== action.id){
				return state;
			}

			if (action.policy === "replace"){
				return Object.assign({}, state, {data: action.data, view:action.view})
			}else{
				return Object.assign({}, state, {data: [...state.data, action.data], view:action.view})
			}
			
		default:
			return state;
	}
}

//used by test manager - apps are all the mock apps running on node red.
export default function apps(state = {data:[], deploying:false}, action) {
  	switch (action.type) { 
	  
	  
	  case DEPLOYING_FLOWS:
	  	return Object.assign({}, state, {deploying:true});
	  	
	  //reset the app data when we retest a flow or we load in a new flow
	  case DEPLOY_SUCCESS:
	  case RECEIVE_FLOWS:
	  	return Object.assign({}, state, {deploying:false, data:[]});
	  	//return Object.assign({}, state, {deploying:false, data:[]});
	  	
	  case APP_MESSAGE:
	  
	  	if (!state.deploying){
	  		return Object.assign({}, state, {data:addIfNew(state, action).map(s=>{
	  			return app(s, action);
	  		})});
	  	}
	  	
	  	return state;
	  	

	  default:
	    return state;
	}
}