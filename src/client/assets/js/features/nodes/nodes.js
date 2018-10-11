import { actionConstants as nodeActionTypes } from './constants';
import { createStructuredSelector, createSelector } from 'reselect';
import { NODE_WIDTH } from 'constants/ViewConstants';
import { actionConstants as portActionTypes } from "features/ports/constants";

export const NAME = 'nodes';

const { LINK_SELECTED } = portActionTypes;
const FOREIGN_MOUSE_UP = 'iot.red/mouse/MOUSE_UP';


function _configureNode(current, changes) {

  let _n = { ...current, ...changes };

  try {
    _n.label = (typeof _n._def.label === "function" ? _n._def.label.bind(_n).call() : _n._def.label) || _n._def.label;
  } catch (err) {
    console.log(`Definition error: ${_n.type}.label`, err);
    _n.label = _n.nt;
  }

  if (_n._def.labelStyle) {
    try {
      _n.labelStyle = (typeof _n._def.labelStyle === "function") ? _n._def.labelStyle.bind(_n).call() : _n._def.labelStyle || "";
    } catch (err) {
      console.log(`Definition error: ${d.type}.labelStyle`, err);
    }
  }
  const w = NODE_WIDTH;
  _n.w = w;

  return _n;
}

const initialState = {
  nodes: [],
  nodesById: {},
  nodePos: {}, //keep the x,y positions separate from rest of node details so that components making use of nodesById don't need to re-render on position change!
  configsById: {},
  draggingNode: null,
  selectedId: null,
  configuringId: null,
  buffer: {},
}



export default function reducer(state = initialState, action) {

  let property, value, v;


  switch (action.type) {

    case nodeActionTypes.RECEIVE_FLOWS:

      return {
        ...state,
        nodes: action.nodes.map((node) => node.id),
        nodesById: action.nodes.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {})
      }

    case nodeActionTypes.NODE_CLEAR_ALL:
      return initialState;


    case nodeActionTypes.NODE_DROPPED:
      return {
        ...state,
        nodes: [...state.nodes, action.node.id],
        nodesById: { ...state.nodesById, [action.node.id]: action.node },
        configsById: {
          ...state.configsById,
          [action.node.id]: {
            fn: action.config.fn,
            id: action.config.id,
          }
        },
      }

    case nodeActionTypes.NODE_MOUSE_DOWN:
      console.log("SEEN NODE MOUSE DOWN!!!")
      return {
        ...state,
        draggingNode: action.id,
        selectedId: action.id,
      }

    case nodeActionTypes.NODE_DOUBLE_CLICKED:

      return {
        ...state,
        draggingNode: null,
        selectedId: action.id,
        configuringId: action.id,
      }


    case LINK_SELECTED:
    case nodeActionTypes.NODE_DESELECTED:
    case FOREIGN_MOUSE_UP:
      return {
        ...state,
        selectedId: null,
      };

    //called from features/tabs
    case nodeActionTypes.TAB_DELETE:

      return {
        ...state,
        nodes: state.nodes.filter((id) => {
          const node = state.nodesById[id];
          return node.z != action.id;
        }),
        nodesById: Object.keys(state.nodesById).reduce((acc, key) => {
          const node = state.nodesById[key];
          if (action.id != node.z) {
            acc[key] = node;
          }
          return acc;
        }, {})
      };

    case nodeActionTypes.NODE_DELETE:

      if (!state.selectedId) {
        return state;
      }
      return {
        ...state,
        nodes: state.nodes.filter(item => state.selectedId != item),
        nodesById: Object.keys(state.nodesById).reduce((acc, key) => {
          if (key != state.selectedId) {
            acc[key] = state.nodesById[key];
          }
          return acc;
        }, {}),
        selectedId: null
      };

    //set up the editing buffer by copying all saved properties from defaults into it.
    case nodeActionTypes.NODE_CONFIGURE:
      const defaults = state.nodesById[action.id]._def.defaults || {};
      const values = Object.keys(defaults).reduce((acc, key) => {
        acc[key] = state.nodesById[state.selectedId][key];
        return acc;
      }, {});
      return {
        ...state,
        buffer: values,
      }

    case nodeActionTypes.NODE_INIT_VALUES:

      return {
        ...state,
        buffer: {
          ...state.buffer,
          ...action.keys,
        }
      }


    case nodeActionTypes.NODE_UPDATE_VALUE:


      return {
        ...state,
        buffer: { ...state.buffer, [action.property]: action.value }
      }

    case nodeActionTypes.NODE_INCREMENT_VALUE_KEY:

      property = state.buffer[action.property] || {};
      value = property[action.key];
      v = {};

      v[action.key] = Math.max(action.min || value + action.amount, value + action.amount);

      const nobj = { ...(state.buffer[action.property] || {}), ...v };

      return {
        ...state,
        buffer: { ...state.buffer, [action.property]: nobj }
      };


    case nodeActionTypes.NODE_UPDATE_VALUE_KEY:
      //do some magic with the acuon value too - if array etc.

      property = state.buffer[action.property] || {};
      value = property[action.key];


      if (value != undefined) {
        v = {};

        if (value.constructor === Array) {
          v[action.key] = toggleItem(value, action.value);
        } else {
          v[action.key] = action.value;
        }

        const newobject = { ...(state.buffer[action.property] || {}), ...v };

        return {
          ...state,
          buffer: { ...state.buffer, [action.property]: newobject },
        };
      }

      return state;

    case nodeActionTypes.NODE_CONFIGURE_CANCEL:
      return {
        ...state,
        configuringId: null,
        buffer: {},
      }

    //set the values in current node to values in buffer
    case nodeActionTypes.NODE_CONFIGURE_OK:
      if (state.configuringId) {
        return {
          ...state,
          configuringId: null,
          buffer: {},
          nodesById: { ...state.nodesById, [state.configuringId]: _configureNode(state.nodesById[state.configuringId], state.buffer) },
        };
      }
      return state;

    case nodeActionTypes.MOUSE_UP:

      const { x = 0, y = 0 } = state.nodePos[state.draggingNode] || state.nodesById[state.draggingNode] || {};
      return {
        ...state,
        draggingNode: null,
        nodesById: {
          ...state.nodesById,
          [state.draggingNode]: { ...state.nodesById[state.draggingNode], x, y }
        }
      }


    case nodeActionTypes.MOUSE_MOVE:

      if (state.draggingNode != null) {
        return {
          ...state,
          nodePos: {
            ...state.nodePos,
            [state.draggingNode]: { x: action.x, y: action.y }
          }
        };
      }
      return state;

    case nodeActionTypes.NODE_UPDATE_SCHEMA:
      return {
        ...state,
        nodesById: {
          ...state.nodesById,
          [action.id]: { ...state.nodesById[action.id], schema: action.schema }
        }
      };

    case nodeActionTypes.NODE_UPDATE_DESCRIPTION:

      return {
        ...state,
        nodesById: {
          ...state.nodesById,
          [action.id]: { ...state.nodesById[action.id], description: action.description }
        }
      };

    default:
      return state;
  }
}

const portSelected = (state) => state.ports.output;
const draggingNode = (state) => state[NAME].draggingNode;
const nodesById = (state) => state[NAME].nodesById;
const linksById = (state) => state.ports.linksById;
const nodePos = (state) => state[NAME].nodePos;
const selectedId = (state) => state[NAME].selectedId;
const configuringId = (state) => state[NAME].configuringId;
const node = (state, ownProps) => state[NAME].nodesById[ownProps.id];
const buffer = (state) => state[NAME].buffer;
const id = (state, newProps) => newProps.id;
const w = (state) => state.editor.screen.w;
const h = (state) => state.editor.screen.h;
const tabId = (state) => state.workspace.currentId;
const configsById = (state) => state.nodes.configsById;

const cpos = createSelector([id, nodePos], (id, nodePos) => {
  return id ? nodePos[id] || { x: 0, y: 0 } : { x: 0, y: 0 };
});

const nodes = createSelector([nodesById, tabId], (nodesById, tabId) => {
  return Object.keys(nodesById).reduce((acc, key) => {
    const n = nodesById[key];
    if (n.z === tabId) {
      acc = [...acc, n.id];
    }
    return acc;
  }, []);
})

const links = createSelector([linksById, tabId], (linksById, tabId) => {
  return Object.keys(linksById).reduce((acc, key) => {
    const l = linksById[key];
    if (l.source.z === tabId) {
      acc = [...acc, l.id];
    }
    return acc;
  }, []);
})

const configs = createSelector([nodesById, configsById, tabId], (nodesById, configsById, tabId) => {
  return Object.keys(nodesById).reduce((acc, key) => {
    const n = nodesById[key];
    if (n.z === tabId) {
      acc = [...acc, configsById[n.id]];
    }
    return acc;
  }, []);
});

export const selector = createStructuredSelector({
  nodes,
  configs,
  links,
  w,
  h,
  selectedId,
  configuringId,
  draggingNode,
  portSelected,
  node,
  buffer,
  cpos,
});