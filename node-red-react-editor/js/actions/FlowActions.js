import request from 'superagent';
import { REQUEST_FLOWS, RECEIVE_FLOWS, RECEIVE_FLOWS_ERROR} from '../constants/ActionTypes';
import { NODE_HEIGHT, NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
import {getID, addViewProperties} from '../utils/nodeUtils';
import {register} from '../store/configureStore';
import {scopeify} from '../utils/scopeify';
import config from '../config';

function _lookup(nodeTypes, nodetype){
	const indx = nodeTypes.map(item=>item.name).indexOf(nodetype);
	if (indx != -1)
		return nodeTypes[indx];
	return null;
}

function _addNode(n){
  	
  	//what is the _ here?
	if (n.type.indexOf("subflow") !== 0) {
	    n["_"] = n._def._;
	}
	if (n._def.category == "config") {
	    configNodes[n.id] = n;
	} else {
	    n.ports = [];
	    if (n.outputs) {
	        for (var i=0;i<n.outputs;i++) {
	            n.ports.push(i);
	        }
	    }
	    n.dirty = true;
	    var updatedConfigNode = false;
	    for (var d in n._def.defaults) {
	    	
	        if (n._def.defaults.hasOwnProperty(d)) {
	            var property = n._def.defaults[d];
	            if (property.type) {
	                var type = registry.getNodeType(property.type);
	                if (type && type.category == "config") {
	                    var configNode = configNodes[n[d]];
	                    if (configNode) {
	                        updatedConfigNode = true;
	                        configNode.users.push(n);
	                    }
	                }
	            }
	        }
	    }
	    if (n._def.category == "subflows" && typeof n.i === "undefined") {
	        //var nextId = 0;
	        //RED.nodes.eachNode(function(node) {
	         //   nextId = Math.max(nextId,node.i||0);
	       // });
	        //n.i = nextId+1;
	    }
	}
	if (n._def.onadd) {
	    n._def.onadd.call(n);
	}
	return n;
}

function extractNodes(newNodesObj, store, lookuptype){

	var createNewIds = false;
	var i;
	var n;
	var newNodes;

	

	if (typeof newNodesObj === "string") {
	    if (newNodesObj === "") {
	        return;
	    }
	    try {
	        newNodes = JSON.parse(newNodesObj);
	    } catch(err) {
	        //var e = new Error(RED._("clipboard.invalidFlow",{message:err.message}));
	        //e.code = "NODE_RED";
	        throw err;
	    }
	} else {
	    newNodes = newNodesObj;
	}

	if (!(newNodes.constructor === Array)) {
	    newNodes = [newNodes];
	}

	var unknownTypes = [];
	
	for (i=0;i<newNodes.length;i++) {
	    n = newNodes[i];
	    // TODO: remove workspace in next release+1
	    if (n.type != "workspace" &&
	        n.type != "tab" &&
	        n.type != "subflow" &&
	        !lookuptype(n.type) &&
	        n.type.substring(0,8) != "subflow:" &&
	        unknownTypes.indexOf(n.type)==-1) {
	            unknownTypes.push(n.type);
	    }
	}
	if (unknownTypes.length > 0) {
	    var typeList = "<ul><li>"+unknownTypes.join("</li><li>")+"</li></ul>";
	    var type = "type"+(unknownTypes.length > 1?"s":"");
	    console.log("unknown types!");
	    console.log(unknownTypes);
	    //RED.notify("<strong>"+RED._("clipboard.importUnrecognised",{count:unknownTypes.length})+"</strong>"+typeList,"error",false,10000);
	}

  	/*
	var activeWorkspace = RED.workspaces.active();
	var activeSubflow = getSubflow(activeWorkspace);
	if (activeSubflow) {
	    for (i=0;i<newNodes.length;i++) {
	        var m = /^subflow:(.+)$/.exec(newNodes[i].type);
	        if (m) {
	            var subflowId = m[1];
	            var err;
	            if (subflowId === activeSubflow.id) {
	                err = new Error(RED._("notification.errors.cannotAddSubflowToItself"));
	            }
	            if (subflowContains(m[1],activeSubflow.id)) {
	                err = new Error(RED._("notification.errors.cannotAddCircularReference"));
	            }
	            if (err) {
	                // TODO: standardise error codes
	                err.code = "NODE_RED";
	                throw err;
	            }
	        }
	    }
	}*/

	var defaultWorkspace;
	var activeWorkspace;
	var workspaces = {};
	var new_workspaces = [];
	var workspace_map = {};
	var new_subflows = [];
	var subflow_map = {};
	var node_map = {};
	var new_nodes = [];
	var new_links = [];
	var nid;
	var def;
	for (i=0;i<newNodes.length;i++) {
	    n = newNodes[i];
	    // TODO: remove workspace in next release+1
	    if (n.type === "workspace" || n.type === "tab") {
	        if (n.type === "workspace") {
	            n.type = "tab";
	        }
	        if (defaultWorkspace == null) {
	            defaultWorkspace = n;
	        }
	        if (createNewIds) {
	            nid = getID();
	            workspace_map[n.id] = nid;
	            n.id = nid;
	        }
	        //addWorkspace(n);
	        //RED.workspaces.add(n);
	        //new_workspaces.push(n);
	    } /*else if (n.type === "subflow") {
	        subflow_map[n.id] = n;
	        if (createNewIds) {
	            nid = getID();
	            n.id = nid;
	        }
	        // TODO: handle createNewIds - map old to new subflow ids
	        n.in.forEach(function(input,i) {
	            input.type = "subflow";
	            input.direction = "in";
	            input.z = n.id;
	            input.i = i;
	            input.id = getID();
	        });
	        n.out.forEach(function(output,i) {
	            output.type = "subflow";
	            output.direction = "out";
	            output.z = n.id;
	            output.i = i;
	            output.id = getID();
	        });
	        new_subflows.push(n);
	        addSubflow(n,createNewIds);
	    }*/
	}
	if (defaultWorkspace == null) {
	    defaultWorkspace = { type:"tab", id:getID(), label:'workspace'};
	    //addWorkspace(defaultWorkspace);
	    //RED.workspaces.add(defaultWorkspace);
	    //new_workspaces.push(defaultWorkspace);
	    activeWorkspace = {};//RED.workspaces.active();
	}

	for (i=0;i<newNodes.length;i++) {
	    n = newNodes[i];
	    def = lookuptype(n.type) ? lookuptype(n.type).def : null;

	    if (def && def.category == "config") {
	        var existingConfigNode = null;
	        if (createNewIds) {
	            if (n.z) {
	                if (subflow_map[n.z]) {
	                    n.z = subflow_map[n.z].id;
	                } else {
	                    n.z = workspace_map[n.z];
	                    if (!workspaces[n.z]) {
	                        n.z = activeWorkspace;
	                    }
	                }
	            }
	            /*existingConfigNode = RED.nodes.node(n.id);
	            if (existingConfigNode) {
	                if (n.z && existingConfigNode.z !== n.z) {
	                    existingConfigNode = null;
	                    // Check the config nodes on n.z
	                    for (var cn in configNodes) {
	                        if (configNodes.hasOwnProperty(cn)) {
	                            if (configNodes[cn].z === n.z && compareNodes(configNodes[cn],n,false)) {
	                                existingConfigNode = configNodes[cn];
	                                node_map[n.id] = configNodes[cn];
	                                break;
	                            }
	                        }
	                    }
	                }
	            }*/
	        }

	        if (!existingConfigNode) { //} || !compareNodes(existingConfigNode,n,true) || existingConfigNode._def.exclusive || existingConfigNode.z !== n.z) {
	            var configNode = {id:n.id, z:n.z, type:n.type, users:[]};
	            for (var d in def.defaults) {
	                if (def.defaults.hasOwnProperty(d)) {
	                    configNode[d] = n[d];
	                }
	            }
	            configNode.label = def.label;
	            configNode._def = def;
	            if (createNewIds) {
	                configNode.id = getID();
	            }
	            node_map[n.id] = configNode;
	            new_nodes.push(configNode);
	            //RED.nodes.add(configNode);
	        }
	    }
	}

	for (i=0;i<newNodes.length;i++) {
	    n = newNodes[i];
	    // TODO: remove workspace in next release+1
	    if (n.type !== "workspace" && n.type !== "tab" && n.type !== "subflow") {
	        def = lookuptype(n.type).def;

	        if (!def || def.category != "config") {
	            var node = {x:n.x,y:n.y,z:n.z,type:0,wires:n.wires,changed:false};
	            if (createNewIds) {
	                if (subflow_map[node.z]) {
	                    node.z = subflow_map[node.z].id;
	                } else {
	                    node.z = workspace_map[node.z];
	                    if (!workspaces[node.z]) {
	                        node.z = activeWorkspace;
	                    }
	                }
	                node.id = getID();
	            } else {
	                node.id = n.id;
	                if (node.z == null || (!workspaces[node.z] && !subflow_map[node.z])) {
	                    node.z = activeWorkspace;
	                }
	            }
	            node.type = n.type;
	            node._def = def;
	            if (n.type.substring(0,7) === "subflow") {
	                var parentId = n.type.split(":")[1];
	                var subflow = subflow_map[parentId]||getSubflow(parentId);
	                if (createNewIds) {
	                    parentId = subflow.id;
	                    node.type = "subflow:"+parentId;
	                    node._def = lookuptype(n.type).def;
	                    delete node.i;
	                }
	                node.name = n.name;
	                node.outputs = subflow.out.length;
	                node.inputs = subflow.in.length;
	            } else {
	                if (!node._def) {
	                    if (node.x && node.y) {
	                        node._def = {
	                            color:"#fee",
	                            defaults: {},
	                            label: "unknown: "+n.type,
	                            labelStyle: "node_label_italic",
	                            outputs: n.outputs||n.wires.length,
	                            set: {},//registry.getNodeSet("node-red/unknown")
	                           
	                        }
	                    } else {
	                        node._def = {
	                            category:"config",
	                            set: {},//registry.getNodeSet("node-red/unknown")
	                          
	                        };
	                        node.users = [];
	                    }
	                    var orig = {};
	                    for (var p in n) {
	                        if (n.hasOwnProperty(p) && p!="x" && p!="y" && p!="z" && p!="id" && p!="wires") {
	                            orig[p] = n[p];
	                        }
	                    }
	                    node._orig = orig;
	                    node.name = n.type;
	                    node.type = "unknown";
	                }
	                if (node._def.category != "config") {
	                    node.inputs = n.inputs||node._def.inputs;
	                    node.outputs = n.outputs||node._def.outputs;
	                    for (var d2 in node._def.defaults) {
	                        if (node._def.defaults.hasOwnProperty(d2)) {
	                        
	                            if (node._def.defaults[d2].type) {
	                            	
	                                if (node_map[n[d2]]) {
	                                    node[d2] = node_map[n[d2]].id;
	                                } else {
	                                    node[d2] = n[d2];
	                                }
	                            } else {
	                       
	                                node[d2] = n[d2];
	                            }
	                        }
	                    }
	                }
	            }
 
	            _addNode(node);
	            addViewProperties(node);

	            if (lookuptype(n.type).reducer){
	            	register(store, node.id, scopeify(node.id, lookuptype(n.type).reducer));
	            }
	            //RED.editor.validateNode(node);
	            node_map[n.id] = node;
	            if (node._def.category != "config") {
	                new_nodes.push(node);
	            }
	        }
	    }
	}
	for (i=0;i<new_nodes.length;i++) {
	    n = new_nodes[i];
	    if (n.wires) {
	        for (var w1=0;w1<n.wires.length;w1++) {
	            var wires = (n.wires[w1] instanceof Array)?n.wires[w1]:[n.wires[w1]];
	            for (var w2=0;w2<wires.length;w2++) {
	                if (wires[w2] in node_map) {
	                    var link = {source:n,sourcePort:w1,target:node_map[wires[w2]]};
	                    //addLink(link);
	                    new_links.push(link);
	                }
	            }
	        }
	        delete n.wires;
	    }
	}
	for (i=0;i<new_subflows.length;i++) {
	    n = new_subflows[i];
	    n.in.forEach(function(input) {
	        input.wires.forEach(function(wire) {
	            var link = {source:input, sourcePort:0, target:node_map[wire.id]};
	            //addLink(link);
	            new_links.push(link);
	        });
	        delete input.wires;
	    });
	    n.out.forEach(function(output) {
	        output.wires.forEach(function(wire) {
	            var link;
	            if (subflow_map[wire.id] && subflow_map[wire.id].id == n.id) {
	                link = {source:n.in[wire.port], sourcePort:wire.port,target:output};
	            } else {
	                link = {source:node_map[wire.id]||subflow_map[wire.id], sourcePort:wire.port,target:output};
	            }
	            //addLink(link);
	            new_links.push(link);
	        });
	        delete output.wires;
	    });
	}

	//RED.workspaces.refresh();
	console.log("NICE - now have links");
	console.log(new_links);

	console.log([new_nodes,new_links,new_workspaces,new_subflows]);

	return {nodes: new_nodes, links: new_links}

	//[new_nodes,new_links,new_workspaces,new_subflows];
}

function extractPorts(data){


}

export function fetchFlows(store){
	return function (dispatch, getState) {
		dispatch(requestFlows());
		request
  			.get(`http://${config.redurl}/flows`)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(receiveFlowsError(err));
  				}else{
          			dispatch(receiveFlows(res.body, store, _lookup.bind(this,getState().types.nodetypes)));  //bind the lookup function to the current set of node types
  	 			}
  	 		});		

	}
}

export function requestFlows() {
  return {
    type: REQUEST_FLOWS,
  }
}

export function receiveFlows(data, store, lookuptypes){

  const {nodes, links} = extractNodes(data, store, lookuptypes);
  
  return {
    type: RECEIVE_FLOWS,
    nodes,
  	links,
  }
}

export function receiveFlowsError(){
  return {
    type: RECEIVE_FLOWS_ERROR,
  }
}