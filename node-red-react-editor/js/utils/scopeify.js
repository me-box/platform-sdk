export function scopeify(id, reducer){
	return function (state={},  action){
		if (!action.id || (action.id && action.id != id)){
		 	return state;
		}
		return reducer(state,action);
	}
}