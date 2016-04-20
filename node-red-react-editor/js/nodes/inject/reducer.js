export  function reducer(state = {inject:"yes"}, action) {
   return Object.assign({}, state, {inject: "hmm!"})
}