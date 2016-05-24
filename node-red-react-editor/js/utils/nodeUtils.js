import { NODE_HEIGHT, NODE_WIDTH, GRID_SIZE} from '../constants/ViewConstants';
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

export function convertNode(n, links, exportCreds) {

    exportCreds = exportCreds || false;
    var node = {};
    node.id = n.id;
    node.type = n.type;
    node.z = n.z;
    if (node.type == "unknown") {
        for (var p in n._orig) {
            if (n._orig.hasOwnProperty(p)) {
                node[p] = n._orig[p];
            }
        }
    } else {
        for (var d in n._def.defaults) {
            if (n._def.defaults.hasOwnProperty(d)) {
                node[d] = n[d];
            }
        }
        if(exportCreds && n.credentials) {
            var credentialSet = {};
            node.credentials = {};
            for (var cred in n._def.credentials) {
                if (n._def.credentials.hasOwnProperty(cred)) {
                    if (n._def.credentials[cred].type == 'password') {
                        if (n.credentials["has_"+cred] != n.credentials._["has_"+cred] ||
                            (n.credentials["has_"+cred] && n.credentials[cred])) {
                            credentialSet[cred] = n.credentials[cred];
                        }
                    } else if (n.credentials[cred] != null && n.credentials[cred] != n.credentials._[cred]) {
                        credentialSet[cred] = n.credentials[cred];
                    }
                }
            }
            if (Object.keys(credentialSet).length > 0) {
                node.credentials = credentialSet;
            }
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
            return d.source === n;
        });
        

        for (var j=0;j<wires.length;j++) {
            var w = wires[j];
            if (w.target.type != "subflow") {
                node.wires[w.sourcePort].push(w.target.id);
            }
        }
    }
    return node;
}
