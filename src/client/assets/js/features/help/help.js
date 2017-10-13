import { createStructuredSelector } from 'reselect';

const TOGGLE_HELP  = 'iot.red/help/TOGGLE_HELP';

export const NAME = 'help';

const initialState = {
	visible:false, 
}

export default function reducer(state = initialState , action) {
	switch (action.type) {
		case TOGGLE_HELP:
			return {
						...state,
						visible: !state.visible
					};	
		default:
			return state;
	}	
}

function toggleHelp(){
	return {
		type: TOGGLE_HELP
	}
}

const node = (state) => {
	return state.nodes.selectedId ? state.nodes.nodesById[state.nodes.selectedId] : null;
}

const visible = (state) =>  state.nodes.selectedId && !state.nodes.configuringId && !state.test.visible && !state.workspace.publishervisible

export const selector = createStructuredSelector({
  visible,
  node,
});

export const actionCreators = {
 toggleHelp
};