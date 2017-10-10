import { createStructuredSelector } from 'reselect';
import moment from 'moment';

const TOGGLE_CONSOLE  = 'iot.red/serverconsole/TOGGLE_CONSOLE';
const NEW_MESSAGE  = 'iot.red/serverconsole/NEW_MESSAGE';

export const NAME = 'serverconsole';

const initialState = {
	visible:true, 
	messages:[],
}

export default function reducer(state = initialState , action) {
	switch (action.type) {
		case TOGGLE_CONSOLE:
			return {
				...state,
				visible: !state.visible
			};	

		case NEW_MESSAGE:
			return {
				...state,
				messages: [{ts:action.ts,msg:action.msg},...state.messages].slice(0,30)
			};	

		default:
			return state;
	}	
}

function toggleConsole(){
	return {
		type: TOGGLE_CONSOLE
	}
}

function newMessage(msg){
	return {
		type: NEW_MESSAGE,
		ts: moment().format("HH:mm:ss"),
		msg
	}
}

const serverconsole = (state)=>state[NAME];

export const selector = createStructuredSelector({
  serverconsole
});

export const actionCreators = {
 toggleConsole,
 newMessage,
};