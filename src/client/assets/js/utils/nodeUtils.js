import { NODE_HEIGHT, NODE_WIDTH} from '../constants/ViewConstants';
import {calculateTextWidth} from './utils';

export function getID(){
   return (1+Math.random()*4294967295).toString(16);
}

export function addViewProperties(node){

  //create label
  try {
        node.label  = (typeof node._def.label  === "function" ? node._def.label.bind(node._def).call() : node._def.label ) || node._def.label ;
  } catch(err) {
       console.log(`Definition error: ${node._def.type}.label`,err);
        node.label = node.type;
  }
  node.h = NODE_HEIGHT; //Math.max(NODE_HEIGHT,(node._def.outputs||0) * 15);
  node.w = NODE_WIDTH; //Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(node.label, "node_label", 50)+(node._def.inputs>0?7:0))/GRID_SIZE)));

  //create label style
  if (node._def.labelStyle){
      try{
        node.labelStyle = (typeof node._def.labelStyle === "function") ? node._def.labelStyle.bind(node._def).call() : node._def.labelStyle || "";    
      }catch (err){
        console.log(`Definition error: ${node.type}.labelStyle`,err);
      }
  }
}

export function convertNode(n, links=[]) {

    console.log("converting node");
    console.log(n);
    console.log(links);
    
    var node = {};
    node.id = n.id;
    node.type = n.type;
    node.z = n.z;
    	
    for (var d in n._def.defaults) {
    	
        if (n._def.defaults.hasOwnProperty(d)) {
            node[d] = n[d] || n._def.defaults[d].value;
        }
    }

    if (n._def.category != "config") {
        node.x = n.x;
        node.y = n.y;
        node.wires = [];
        
        for(var i=0;i<n.outputs;i++) {
            node.wires.push([]);
        }

        var wires = links.filter(function(d){
            return d.source.id === n.id;
        });
        
        for (var j=0;j<wires.length;j++) {
            var w = wires[j];
            node.wires[w.sourcePort].push(w.target.id);
        }
    } 	
    return node;
}

export function setNode(current, changes){
  
  let _n = Object.assign(current, changes);

  try {
        _n.label  = (typeof _n._def.label  === "function" ? _n._def.label.bind(_n).call() : _n._def.label ) || _n._def.label ;
  } catch(err) {
       console.log(`Definition error: ${_n.type}.label`,err);
        _n.label = _n.nt;
  }

  if (_n._def.labelStyle){
      try{
        _n.labelStyle = (typeof _n._def.labelStyle === "function") ? _n._def.labelStyle.bind(_n).call() : _n._def.labelStyle || "";    
      }catch (err){
        console.log(`Definition error: ${d.type}.labelStyle`,err);
      }
  }
  
  //const w = Math.max(NODE_WIDTH,GRID_SIZE*(Math.ceil((calculateTextWidth(_n.label, "node_label", 50)+(_n.inputs>0?7:0))/GRID_SIZE)));
  const w = NODE_WIDTH;
  _n.w = w; 
  return _n;

}


export function lookup(nodeTypes, nodetype){
  const indx = nodeTypes.map(item=>item.name).indexOf(nodetype);
  if (indx != -1)
    return nodeTypes[indx];
  return null;
}

export function addNode(n){
    
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
