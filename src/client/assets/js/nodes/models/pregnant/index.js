import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";

const ptype = (nid="", inputs=[])=>{
    
    const incoming = (extract_ptype_from_inputs(inputs,nid)[nid] ||[]).reduce((acc,item)=>{
        if (item.subtype){
            acc = [...acc, item.subtype];
        }
        return acc;
    },[]);
    
    

    const matches = [
        {
                attributes:["gender", "age", "spending_habits"],
                accuracy: 0.5
        }
    ]

    const ptypes = matches.reduce((acc,item)=>{
        const foundall = item.attributes.reduce((acc, attribute)=>{
            return acc && incoming.indexOf(attribute) != -1; 
        },true);

        if (foundall){
            acc = [...acc, {

                      type: "sensitive",
                      category: "health",
                      subtype: "pregnant",
                      ordinal: "secondary",
                      description: "infer whether a user is pregnant",
                      required: ["payload"],
                      accuracy: item.accuracy,
                }
            ]
        }
        return acc;

    },[]);


    return {[nid]:ptypes};
}

const config = {

    category: 'models',    
    
    color: '#009688',
    
    defaults: {             
        name: {value:""},
    },
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-child",    
    
    unicode: '\uf1ae',    
    
    label: function() {     
        return this.name||"pregnant";
    },
    
    description: ()=> "a node for extracting pregnancy likelihood from input data",
    
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
                                    type:"string", 
                                    description: "true or false", 
                            }
                        },
                        ptype: ptype(nid,inputs), 
                        //{..._ptype, [nid] : [...(_ptype[nid]||[]), ...ptype(nid,inputs)]}
                    }
                }
    },

    risk: (subtype="")=>{
      return {
          score: 5,
          reason: "infers pregnancy!"
      }        
    },

    descriptionfn: (name)=>{
        return "figures out whether a user is pregnant based upon input data";
    }
    
}

export default {
    type:     "pregnant",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"pregnant"}),
    node:     Node,
}