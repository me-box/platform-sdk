import React from 'react';
import { render } from 'react-dom';
import { actionConstants as nodeActionTypes } from "./constants";
import { NODE_WIDTH, MOUSE_X_OFFSET, MOUSE_Y_OFFSET } from 'constants/ViewConstants';
import { getID, addViewProperties, lookup } from 'utils/nodeUtils';
import { calculateTextWidth, toggleItem } from 'utils/utils';
import { scopeify } from 'utils/scopeify';
import { register, unregister, unregisterAll } from 'app/store/configureStore';
import { downstreamnodes, fromnode, tonode } from "utils/tree";

function loadNode({ component, node, reducer, schemas = {} }) {
  console.log("|| AM IN LOAD NODE!!!", node);

  return function (dispatch, getState) {


    const schema = schemas[node.id] || {};

    const _node = { ...node, schema, description: _description(node._def) };



    addViewProperties(_node);

    console.log("**** created node", _node);

    if (reducer) {
      register(_node.id, scopeify(_node.id, reducer));
    }

    dispatch({ type: nodeActionTypes.NODE_DROPPED, node: _node, config: { id: _node.id, fn: component } });



  };
}

function _schema(node, inputs) {
  console.log("OK IN _SCGAME for node", node, "inoputs", inputs);

  if (node._def.schemafn) {
    const current = Object.keys(node._def.defaults).reduce((acc, key) => {
      acc[key] = node[key];
      return acc;
    }, {});

    return node._def.schemafn(node.id, current, inputs);
  }
  return {}
}

function _description(def) {

  if (def.nodetype === "dbfunction") {
    JSON.stringify(def.defaults, null, 4);
  }


  if (def.descriptionfn) {
    return def.descriptionfn(def);
  }

  return def.type || "";
}

function dropNode({ component, nt, def, reducer }, x0, y0) {


  return function (dispatch, getState) {


    //adjust x and y for offsets
    const x = x0 + MOUSE_X_OFFSET + NODE_WIDTH / 2;
    const y = y0 + MOUSE_Y_OFFSET + getState().mouse.top + NODE_WIDTH / 2;


    if (x < 0) {
      return;
    }

    let _def = Object.assign({}, def);
    const id = getID();


    const current = Object.keys(def.defaults).reduce((acc, key) => {
      acc[key] = def.defaults[key].value;
      return acc;
    }, {})

    const node = {
      id,
      type: nt,
      _def: _def,
      _: (id) => { return id },
      inputs: _def.inputs || 0,
      outputs: _def.outputs,
      schema: _def.schemafn ? _def.schemafn(id, current) : {},
      description: _description(current),
      changed: true,
      selected: true,
      dirty: true,
      x: x,
      y: y,
      z: getState().workspace.currentId,
    }

    //so old nodes that are loaded won't necessarily have the new defaults!
    for (var d in node._def.defaults) {
      if (node._def.defaults.hasOwnProperty(d)) {
        node[d] = node._def.defaults[d].value;
      }
    }

    addViewProperties(node);

    //might need to make this a separate action?
    //register this reducer and force nodeid to be passed in when state changes.  scopeify will ignore any actions that do not have this node's id as a parameter
    //this means that instances of the same node can transparently make use of the same action constants without a clash!.
    if (reducer) {
      register(node.id, scopeify(node.id, reducer));
    }


    dispatch({ type: nodeActionTypes.NODE_DROPPED, node, config: { id: node.id, fn: component } });
  }
}

function initNodeKeys(keys) {
  return {
    type: nodeActionTypes.NODE_INIT_VALUES,
    keys
  }
}

function updateNode(property, value) {
  return {
    type: nodeActionTypes.NODE_UPDATE_VALUE,
    property,
    value,
  }
}

function updateNodeValueKey(property, key, value) {

  return {
    type: nodeActionTypes.NODE_UPDATE_VALUE_KEY,
    property,
    key,
    value,
  }
}

function incrementNodeValueKey(property, key, amount, min, max) {
  return {
    type: nodeActionTypes.NODE_INCREMENT_VALUE_KEY,
    property,
    key,
    amount,
    min,
    max,
  }
}

function nodeMouseDown(id) {

  return (dispatch, getState) => {

    dispatch({
      type: nodeActionTypes.NODE_MOUSE_DOWN,
      id
    })
  }
}

function nodeDoubleClicked(id) {

  //TODO: WHY TWO EVENTS HERE?
  return (dispatch, getState) => {

    dispatch({
      type: nodeActionTypes.NODE_DOUBLE_CLICKED,
      id,
    });

    dispatch({
      type: nodeActionTypes.NODE_CONFIGURE,
      id
    });

  }
}

function nodeDelete() {
  //TODO; delete registration!
  return (dispatch, getState) => {
    unregister(getState().nodes.selectedId);
    dispatch({ type: nodeActionTypes.NODE_DELETE });
  };
}

function clearNodes() {
  unregisterAll();
  return {
    type: nodeActionTypes.NODE_CLEAR_ALL,
  }
}

function nodeDeselected() {
  return {
    type: nodeActionTypes.NODE_DESELECTED,
  }
}


function deleteTab(id) {
  return {
    type: nodeActionTypes.TAB_DELETE,
    id
  }
}

function mouseMove(x, y) {

  return {
    type: nodeActionTypes.MOUSE_MOVE,
    x,
    y,
  }
}

function nodeMouseUp() {

  return {
    type: nodeActionTypes.MOUSE_UP,
  }
}

function resolve(nid, nodes, links, resolved) {

  if (resolved[nid]) {
    return resolved[nid];
  }

  const inputs = links.filter((link) => {
    return link.target.id === nid;
  });

  if (inputs.length === 0) {
    return _schema(nodes[nid], []);
  }

  return _schema(nodes[nid], inputs.map((i) => ({ ...nodes[i.source.id], schema: resolve(i.source.id, nodes, links, resolved) })));
}
//need links to use to calculate schemas based on inputs!

function receiveFlows(nodes, links) {
  return (dispatch, getState) => {

    const lookuptype = lookup.bind(null, getState().palette.types);

    const schemas = {};

    const tmpnodes = nodes.reduce((acc, n) => {
      return { ...acc, [n.id]: n }
    }, {});

    console.log("----> tmp nodes are", tmpnodes);

    nodes.map(node => {
      const inputs = links.filter((link) => {
        return link.target.id === node.id;
      }).map((link) => {
        schemas[link.source.id] = resolve(link.source.id, tmpnodes, links, schemas);
      });
    })

    console.log("now resolved is", schemas);

    const _nodes = nodes.map((node) => {
      const { component, reducer } = lookuptype(node.type);

      console.log("** LOADING NODE", node, "component", component);
      dispatch(loadNode({ component, node, reducer, schemas }));
    });
    console.log("DISPATCHING RECEIEVE FLOWS///!");
  };

  return {
    type: nodeActionTypes.RECEIVE_FLOWS,
    nodes,
  };

}


export const actionCreators = {
  dropNode,
  initNodeKeys,

  clearNodes,
  updateNodeValueKey,
  updateNode,
  incrementNodeValueKey,

  nodeMouseDown,
  nodeMouseUp,
  nodeDoubleClicked,

  deleteTab,
  mouseMove,

  nodeDelete,
  nodeDeselected,
  receiveFlows,
}