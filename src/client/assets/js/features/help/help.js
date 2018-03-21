import { createStructuredSelector } from 'reselect';

const SET_SUBTYPE  = 'iot.red/help/SET_SUBTYPE';

export const NAME = 'help';

const initialState = {
//	visible:false, 
	subtype:"description"
}

export default function reducer(state = initialState, action) {
	
	switch (action.type) {
		case 'iot.red/ports/LINK_SELECTED':
			return {
				...state,
				subtype: "personal data"
			};
		
		case 'iot.red/nodes/NODE_MOUSE_DOWN':
			return {
				...state,
				subtype: "description"
			}

		case SET_SUBTYPE:
			return {
						...state,
						subtype: action.subtype
			};

		default:
			return state;
	}
}

/*function toggleHelp(subtype="node"){
	return {
		type: TOGGLE_HELP,
		subtype,
	}
}*/

function setSubtype(subtype){
	return {
		type: SET_SUBTYPE,
		subtype,
	}
}

const _from = (link)=>{
	return link.split(":")[1]
} 

const node = (state) => {
	if (state.nodes.selectedId) 
		return state.nodes.nodesById[state.nodes.selectedId];

	if (state.ports.selectedId){
		const nid = _from(state.ports.selectedId);
		return state.nodes.nodesById[nid];
	}

	return null;
}

const subtype = (state)=>{	
	return state[NAME].subtype
}

const visible = (state) =>  {

	return (state.nodes.selectedId && !state.nodes.configuringId && !state.test.visible && !state.workspace.publishervisible)
	|| state.ports.selectedId

}
export const selector = createStructuredSelector({
  visible,
  subtype,
  node,
});

export const actionCreators = {
  setSubtype
};