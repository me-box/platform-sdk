import { REGISTER_TYPE } from '../constants/ActionTypes';

export default function types(state = [], action) {
  switch (action.type) {

    case REGISTER_TYPE:
      return [
        ...state,
        {
            name: action.name,
            def: action.def,
            reducer: action.reducer,
        }
      ]
      

	  default:
	    return state;
  }
}