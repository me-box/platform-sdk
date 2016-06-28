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
    
    //add node properties
    console.log("node defaults are");
    console.log(n._def.defaults);
    
    if (node.type == "unknown") {
    	console.log("nde type is unklnown!");
        for (var p in n._orig) {
            if (n._orig.hasOwnProperty(p)) {
                node[p] = n._orig[p];
            }
        }
    } else {
        for (var d in n._def.defaults) {
        	console.log("checking if defaults")
        	console.log(n._def.defaults)
        	
        	console.log("has own proeprty");
        	console.log(d);
        	
            if (n._def.defaults.hasOwnProperty(d)) {
            	console.log("yes!");
                node[d] = n[d];
            }else{
            	console.log("nope!");
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
    console.log("converted node is");
    console.log(node);
    
    return node;
}
