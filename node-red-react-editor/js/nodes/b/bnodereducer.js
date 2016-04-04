import { TEST_ACTION } from '../../constants/ActionTypes';

export  function bnodereducer(state = 0, action) {
  switch (action.type) {
	  case TEST_ACTION:
	  	console.log("ok I have seen a test action!");
	    return state + 1;
	  default:
	    return state;
  }
}
