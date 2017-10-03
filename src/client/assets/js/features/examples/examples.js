import { createStructuredSelector } from 'reselect';
import {actionCreators as tabActions} from 'features/workspace';
import {actionCreators as repoActions} from 'features/repos/actions';
import request  from 'superagent';
import config from 'config';
import {lookup} from 'utils/nodeUtils';

const TOGGLE_VISIBLE  = 'iot.red/examples/TOGGLE_VISIBLE';

export const NAME = 'examples';

const initialState = {
  visible:false,
}

export default function samples(state = initialState, action) {
	
  switch(action.type){

 
    case TOGGLE_VISIBLE:
      return {...state, visible: !state.visible}
        
		default:
			return state;
	}
}


function toggleVisible(){
  return {
    type: TOGGLE_VISIBLE,
  }
}

const examples = (state) => state["repos"].examples;
const visible  = (state) => state[NAME].visible;

export const selector = createStructuredSelector({
  examples, 
  visible,
});

export const actionCreators = {
  toggleVisible,
};