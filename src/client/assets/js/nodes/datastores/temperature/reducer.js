import { TEST_ACTION } from 'constants/ActionTypes';

export  function reducer(state = 0, action) {
  switch (action.type) {
	  case TEST_ACTION:
	    return state + 1;
	  default:
	    return state;
  }
}
