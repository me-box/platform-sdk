import { createStructuredSelector, createSelector } from 'reselect';
import moment from 'moment';

const NEW_MESSAGE = 'iot.red/serverconsole/NEW_MESSAGE';

export const NAME = 'serverconsole';

const initialState = {
	messages: [],
}

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case NEW_MESSAGE:
			return {
				...state,
				messages: [{ ts: action.ts, msg: action.msg }, ...state.messages].slice(0, 30)
			};

		default:
			return state;
	}
}



function newMessage(msg) {
	return {
		type: NEW_MESSAGE,
		ts: moment().format("HH:mm:ss"),
		msg
	}
}

const visible = (state) => state.test.visible;
const publishervisible = (state) => state.workspace.publishervisible;
const configuringId = (state) => state.nodes.configuringId;
const messages = (state) => state[NAME].messages;

const serverconsole = createSelector([visible, publishervisible, configuringId, messages], (visible, publishervisible, configuringId, messages) => {
	return {
		messages,
		visible: (visible || publishervisible) && configuringId === null
	}
});

export const selector = createStructuredSelector({
	serverconsole
});

export const actionCreators = {
	newMessage,
};