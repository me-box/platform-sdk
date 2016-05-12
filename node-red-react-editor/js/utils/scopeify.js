export function scopeify(id, reducer){
	return function (state = {},  action){
		if (!action.id || (action.id && action.id != id)){
		 	return state;
		}
		
		let initial = Object.keys(state).length === 0 ? undefined : state;
		return reducer(initial,action); //needs to be undefined at start to ensure reducer sets up initial default state!
	}
}