import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";


const allIndexes = (items, value)=>{
    return items.reduce((acc,item,i)=>{
        if (item===value){
            return [...acc, i]
        }
        return acc;
    },[]);   
}

const min = (items)=>{
    return items.reduce((acc,item)=>{
        return Math.min(item,acc);
    },Number.MAX_SAFE_INTEGER)
}

const ptype = (nid="", inputs=[])=>{

  const incoming = (extract_ptype_from_inputs(inputs,nid)[nid] ||[]).reduce((acc,item)=>{
      if (item.subtype){
          acc = [...acc, {subtype:item.subtype, accuracy:item.accuracy||1}];
      }
      return acc;
  },[]);
  
  

  const matches = [
      {
              attributes:["browsing"],
              accuracy: 0.8
      }
  ]

  const ptypes = matches.reduce((acc,item)=>{
     
      const subtypes = incoming.map(i=>i.subtype);

      const result = item.attributes.reduce((acc, attribute)=>{
         
          const indices = allIndexes(subtypes, attribute);
         

          if (indices.length > 0){    
              const accuracy = min(indices.map(i=>incoming[i].accuracy || 1));
              return {foundall: acc.foundall, accuracy : acc.accuracy * accuracy};
          }
          return {foundall:false, accuracy:acc.accuracy};
      },{accuracy:item.accuracy, foundall:true});

      if (result.foundall){
          acc = [...acc, 
              {
                type: "personal",
                category: "physical",
                subtype: "gender",
                status: "inferred",
                ordinal: "secondary",
                description: "infered user gender",
                required: ["payload"],
                accuracy: 0.45,
              }
          ]
      }
      return acc;
  },[]);
  return {[nid]:ptypes};
}

const config = {

    category: 'profilers',    
    
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
    
    description: ()=> "a node for extracting user's gender from input data",
    
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
                                    description: "either 'male' or 'female'", 
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
          reason: "infers a users gender"
      }        
    },

    descriptionfn: (name)=>{
        return "figures out user's gender from input data";
    }
    
}

export default {
    type:     "gender",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"gender"}),
    node:     Node,
}