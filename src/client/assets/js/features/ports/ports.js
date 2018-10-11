import { createStructuredSelector, createSelector } from 'reselect';
import { OUTPUT_WIDTH } from 'constants/ViewConstants';
import { actionConstants as portActionTypes } from './constants';
import { actionConstants as nodeActionTypes } from "features/nodes/constants";
import { downstreamnodes, fromnode, tonode } from "utils/tree";
import { resolveconditions } from "utils/privacy";

const FOREIGN_MOUSE_UP = 'iot.red/mouse/MOUSE_UP';
const FOREIGN_CLEAR = 'iot.red/editor/CLEAR';
const { NODE_MOUSE_DOWN } = nodeActionTypes;

export const NAME = 'ports';

const initialState = {
	output: null,

	selectedId: null,

	activeLink: {
		source: {
			x: 0,
			y: 0
		},
		target: {
			x: 0,
			y: 0
		}
	},

	links: [],
	linksById: {},

	offset: {
		x: 0,
		y: 0
	}
};


const _updatedownstream = (id, dispatch, downstream, getState) => {

	downstream.forEach((n) => {

		const nodes = getState().nodes.nodesById;
		const node = nodes[n];

		const inputs = getState().ports.links.filter((key) => {
			return tonode(key) === n;
		}).map((linkId) => {
			const { id, schema } = nodes[fromnode(linkId)];
			return { id, schema };
		});

		if (node) {

			const current = Object.keys(node._def.defaults).reduce((acc, key) => {
				acc[key] = node[key];
				return acc;
			}, {});

			const schema = node._def.schemafn(n, current, inputs || [], []);
			const resolved = node.inputs > 0 ? resolveconditions(n, schema) : schema;

			dispatch({
				type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
				id: n,
				schema: resolved,
			});
		}
		else {

			dispatch({
				type: 'iot.red/nodes/NODE_UPDATE_SCHEMA',
				id: n,
				schema: {},
			});
		}
	});
}

export default function reducer(state = initialState, action) {

	switch (action.type) {

		case portActionTypes.LINK_SELECTED:

			return { ...state, selectedId: action.link };

		case NODE_MOUSE_DOWN:
			return {
				...state,
				selectedId: null
			};

		case portActionTypes.TAB_DELETE:

			return {
				...state,
				links: state.links.filter((id) => {
					const link = state.linksById[id];
					return (link.source.z !== action.id && link.target.z !== action.id);
				}),
				linksById: Object.keys(state.linksById).reduce((acc, id) => {
					const link = state.linksById[id];
					if (link.source.z !== action.id && link.target.z !== action.id) {
						acc[id] = link;
					}
					return acc;
				}, {})
			};

		case portActionTypes.CLEAR_LINKS:
			return { ...state, ...initialState }

		case portActionTypes.DELETE_LINK:

			return {
				...state,
				links: state.links.filter((id) => id != state.selectedId),
				linksById: Object.keys(state.linksById).reduce((acc, id) => {
					if (id != state.selectedId) {
						acc[id] = state.linksById[id];
					}
					return acc;
				}, {}),
				selectedId: null,
			};

		case portActionTypes.DELETE_NODE:

			return {
				...state,
				links: state.links.filter((id) => {
					const link = state.linksById[id];
					return (link.source.id !== action.node && link.target.id !== action.node);
				}),
				linksById: Object.keys(state.linksById).reduce((acc, id) => {
					const link = state.linksById[id];
					if (link.source.id !== action.node && link.target.id !== action.node) {
						acc[id] = link;
					}
					return acc;
				}, {})
			};



		case portActionTypes.RECEIVE_FLOWS:

			return {
				...state,
				links: action.links.map((link) => link.id),
				linksById: action.links.reduce((acc, item) => {
					acc[item.id] = item;
					return acc;
				}, {})
			}

		case portActionTypes.PORT_MOUSE_OVER:

			if (state.output && (state.output.node.id != action.node.id && action.node.inputs > 0) && action.portIndex == 0) {

				const id = `${state.output.sourcePort}:${state.output.node.id}:${action.node.id}:${action.portIndex}`;

				return {
					...state,
					links: [...state.links, id],
					linksById: {
						...state.linksById,
						[id]: {
							id,
							sourcePort: state.output.sourcePort,
							source: state.output.node,
							target: {
								id: action.node.id,
								z: action.node.z
							},
						}
					},
					output: null,
				}
			}
			return state;

		case portActionTypes.PORT_MOUSE_DOWN:

			const privacy = action.node.schema && action.node.schema.output ? action.node.schema.output.ptype || [] : [];

			return {
				...state,
				output: {
					node: {
						id: action.node.id,
						z: action.node.z,
						privacy,
					},
					sourcePort: action.portIndex,
					portType: action.portType,
				},
				offset: { x: action.node.x + (action.node.w / 2), y: action.node.y },
			};

		case FOREIGN_MOUSE_UP:
			return {
				...state,
				output: null
			};

		case portActionTypes.MOUSE_MOVE:
			if (state.output) {
				return {
					...state,
					activeLink: {
						//need a soruce port!

						source: {
							x: OUTPUT_WIDTH - 5,
							y: -5,
						},

						target: {
							x: action.x - state.offset.x,
							y: action.y - state.offset.y,
						}
					}
				}
			}
			return state;


		case FOREIGN_CLEAR:
			return initialState;

		default:
			return state;
	}
}


function linkSelected(link) {

	return {
		type: portActionTypes.LINK_SELECTED,
		link,
	}
}

function portMouseDown(node, portType, portIndex, e) {

	return {
		type: portActionTypes.PORT_MOUSE_DOWN,
		node,
		portType,
		portIndex,
	}
}

function portMouseOver(node, portType, portIndex, e) {

	return (dispatch, getState) => {
		if (getState().ports.output) {

			const links = getState().ports.links;
			const downstream = downstreamnodes(node.id, links);

			dispatch({
				type: portActionTypes.PORT_MOUSE_OVER,
				node,
				portType,
				portIndex,
			});

			_updatedownstream(node.id, dispatch, downstream, getState);
		}
	}
}

function linkDelete(link) {

	return (dispatch, getState) => {
		const links = getState().ports.links;
		const id = tonode(link)
		const downstream = downstreamnodes(id, links);

		dispatch({
			type: portActionTypes.DELETE_LINK,
			link
		});

		_updatedownstream(id, dispatch, downstream, getState);
	}
}

function clearLinks() {
	return {
		type: portActionTypes.CLEAR_LINKS,
	}
}

function nodeDelete(node) {

	return (dispatch, getState) => {
		const links = getState().ports.links;
		const downstream = downstreamnodes(node, links);

		dispatch({
			type: portActionTypes.DELETE_NODE,
			node
		});

		_updatedownstream(node, dispatch, downstream, getState);
	}
}

function mouseMove(x, y) {
	return {
		type: portActionTypes.MOUSE_MOVE,
		x,
		y,
	}
}

function deleteTab(id) {

	return {
		type: portActionTypes.TAB_DELETE,
		id
	}
}

function receiveFlows(links) {
	return {
		type: portActionTypes.RECEIVE_FLOWS,
		links,
	}
}

const clink = (state, ownProps) => state[NAME].linksById[ownProps.id];
const nodesById = (state) => state.nodes.nodesById;

const link = createSelector([clink, nodesById], (link, nodesById) => {
	if (link) {
		return {
			id: link.id,
			source: nodesById[link.source.id],
			target: nodesById[link.target.id],
			sourcePort: link.sourcePort,
		}
	}

});

const nodePos = (state) => state.nodes.nodePos;

const cpos = createSelector([nodePos], (nodePos) => nodePos);
const selectedId = (state) => state[NAME].selectedId;

export const selector = createStructuredSelector({
	selectedId,
	link,
	cpos,
});

export const actionCreators = {
	linkSelected,
	linkDelete,
	clearLinks,
	nodeDelete,
	portMouseDown,
	portMouseOver,
	mouseMove,
	deleteTab,
	receiveFlows,
};
