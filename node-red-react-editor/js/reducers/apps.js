import { APP_MESSAGE } from '../constants/ActionTypes';


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

			
			return Object.assign({}, state, {data: action.data, view:action.view})
		
			
		default:
			return state;
	}
}

export default function apps(state = [], action) {
  	switch (action.type) {
	  
	  case APP_MESSAGE:
	  
	  	return addIfNew(state, action).map(a=>{
	  		return app(a, action);
	  	})

	  	return newstate;

	  default:
	    return state;
	}
}