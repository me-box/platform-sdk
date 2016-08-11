import { APP_MESSAGE, RECEIVE_FLOWS } from '../constants/ActionTypes';


const addIfNew = (state, action) =>{
	switch (action.type){

		case APP_MESSAGE:
		
			//can make this more efficient if need 
			if (state.map(t=>{return t.id}).indexOf(action.id) !== -1){
				return state.map(t=>{
					if (t.id === action.id){
						t.name = action.name;
					}
					return t;
				});
			}
			return [...state, {id:action.id, name:action.name, view:action.view, data:[]}]

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
export default function apps(state = [], action) {
  	switch (action.type) {
	  
	  case RECEIVE_FLOWS:
	  	return [];
	  	
	  case APP_MESSAGE:
	  
	  	return addIfNew(state, action).map(a=>{
	  		return app(a, action);
	  	});
	  	

	  default:
	    return state;
	}
}