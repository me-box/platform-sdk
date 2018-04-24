import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";

const ptype = (nid="", inputs=[])=>{
    
    const incoming = extract_ptype_from_inputs(inputs,nid)[nid];
    
    console.log("incomimg ptypes are", incoming);



    return {[nid]:[{
              type: "personal",
              category: "behaviour",
              subtype: "integrity",
              ordinal: "secondary",
              description: "infer user's integrity",
              required: ["payload"],
              accuracy: 0.55,
              
            }
        ]};
}

const config = {

    category: 'models',    
    
    color: '#009688',
    
    defaults: {             
        name: {value:""},
    },
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-thumbs-up",    
    
    unicode: '\uf164',    
    
    label: function() {     
        return this.name||"integrity";
    },
    
    description: ()=> "a node for extracting user's integrity from input data",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },

    schemafn:(nid="", node, inputs=[])=>{
        

     
        return {
                    output: {
                        type: "object",
                        description: "container object",
                        properties: {
                            name: {type:'string', description: "a name assigned to this node"}, 
                            payload: {
                                    type:'number', 
                                    description: "integrity value from 0 (no integrity) to 100 (max integrity)", 
                            }
                        },
                        status: "inferred",
                        ptype: ptype(nid,inputs), 
                        //{..._ptype, [nid] : [...(_ptype[nid]||[]), ...ptype(nid,inputs)]}
                    }
                }
    },

    risk: (subtype="")=>{
      return {
          score: 2,
          reason: "infers integrity!"
      }        
    },

    descriptionfn: (name)=>{
        return "figures out users integrity from input data";
    }
    
}

export default {
    type:     "integrity",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"integrity"}),
    node:     Node,
}