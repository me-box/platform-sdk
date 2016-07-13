import request from 'superagent';
import { REQUEST_FLOWS, RECEIVE_FLOWS, RECEIVE_FLOWS_ERROR, TABS_LOAD} from '../constants/ActionTypes';
import { NODE_HEIGHT, NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
import {getID, addViewProperties} from '../utils/nodeUtils';
import {register} from '../store/configureStore';
import {receivedSHA} from '../actions/RepoActions';
import {receivedManifest} from  '../actions/PublisherActions';
import {scopeify} from '../utils/scopeify';
import config from '../config';
import {leave} from '../comms/websocket';

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
	}
	if (n._def.onadd) {
	    n._def.onadd.call(n);
	}
	return n;
}

function extractNodes(newNodesObj, store, lookuptype){

	
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
	    if (n.type != "tab" &&
	        !lookuptype(n.type) && unknownTypes.indexOf(n.type)==-1) {
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

	
	
	
	var node_map = {};
	var new_nodes = [];
	var new_links = [];
	var nid;
	var def;

	for (i=0;i<newNodes.length;i++) {
	    n = newNodes[i];
	    // TODO: remove workspace in next release+1
	    if (n.type !== "tab") {
	        def = lookuptype(n.type).def;

	        if (!def || def.category != "config") {
	            
	            var node = {
	            				x:n.x,
	            				y:n.y,
	            				z:n.z,
	            				type:0,
	            				wires:n.wires,
	            				changed:false
	            			};
	           	
	           	node.id = n.id;
	            node.type = n.type;
	            node._def = def;
	           
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
	
	return {nodes: new_nodes, links: new_links}
}

function extractPorts(data){


}

export function fetchFlow(store, repo){
	
	return function (dispatch, getState) {
		leave("testApp");
		dispatch(requestFlows());
		request
  			.get(`http://${config.root}/github/flow`)
  			.query({repo:repo})
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(receiveFlowsError(err));
  				}else{
  				
  					const flows 	= res.body.flows.content;
  					const manifest 	= res.body.manifest.content;
  					
  					//create all of the tabs
  					dispatch(receiveTabs(flows.filter((node)=>{
  						return node.type === "tab"
  					})));
  					
  					//update the sha of this repo
  					dispatch(receivedSHA(repo,
  										 {
  												flows: res.body.flows.sha,
  												manifest: res.body.manifest.sha
  										 }))
  					
  					
  					//create all of the flows
          			dispatch(receiveFlows(flows, store, _lookup.bind(this,getState().types.nodetypes)));  //bind the lookup function to the current set of node types
  	 			
  	 				//create the manifest
  	 				dispatch(receivedManifest(manifest));
  	 			}
  	 		});		

	}
}

export function requestFlows() {
  return {
    type: REQUEST_FLOWS,
  }
}

export function receiveTabs(tabs){
	return {
		type: TABS_LOAD,
		tabs,
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