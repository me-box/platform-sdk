import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";

const ptype = (nid="", inputs=[])=>{
    
    const incoming = extract_ptype_from_inputs(inputs,nid)[nid];
    
    console.log("incomimg ptypes are", incoming);



    return {[nid]:[{
              type: "personal",
              category: "physical",
              subtype: "gender",
              ordinal: "secondary",
              description: "infer user's gender",
              required: ["payload"],
              accuracy: 0.5,
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
   
    icon: "fa-transgender",    
    
    unicode: '\uf224',    
    
    label: function() {     
        return this.name||"gender";
    },
    
    description: ()=> "a node for extracting gender from input data",
    
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
                                    type:'string', 
                                    description: "one of male, or female", 
                            }
                        },
                        ptype: ptype(nid,inputs), 
                        //{..._ptype, [nid] : [...(_ptype[nid]||[]), ...ptype(nid,inputs)]}
                    }
                }
    },

    risk: (subtype="")=>{
      return {
          score: 2,
          reason: "infers gender!"
      }        
    },

    descriptionfn: (name)=>{
        return "figures out users gender from input data";
    }
    
}

export default {
    type:     "gender",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"gender"}),
    node:     Node,
}