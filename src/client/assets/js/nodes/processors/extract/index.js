import Node from "./node";

const _matches =(nid, filters, key, schema)=>{
  
    const paths = filters.map(i=>`${i.sid}.${i.path.join(".")}`);
    

    const matches = schema.filter((item)=>{
                
        if (!item.required){ 
            return false;
        }

        //shorthand version of allOf is an array with each item that needs to match
        if (Array.isArray(item.required)){
            
            if (item.required.length <= 0)
                return false;
           
            return item.required.reduce((acc, r)=>{
               
                return acc && paths.indexOf(`${key}.${r}`) !== -1;
            },true);
        }

        if (item.required === Object(item.required)){
            //do anyOf, allOf, not check
            return true;
        }
         
    },{}).map((i)=>{
        return {    ...i,
            required: i.required.map(i=>`payload.${key}.${i}`)
        }
    });

    return (matches.length > 0) ?  matches : []
}

const _conditionsmet = (conditions, ptypes)=>{
    const compulsoryattributes =  conditions.reduce((acc,item)=>{
        return [...acc, ...item.attributes];
    },[]);
    
    const existingattributes = ptypes.map(i=>i.subtype);

    return compulsoryattributes.reduce((acc, item)=>{
        return acc && existingattributes.indexOf(item) != -1;
    },true);
}

const config = {
    category: 'processors',    
    color: '#3771C8',
    
    defaults: {             
        
        name: {value:""},
        
        filters: {  
            value:[]
        },
    },
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-code-fork",    
    unicode: '\uf126',    
    label: function() {     
        return this.name||this.topic||"extract";
    },
    
    description: ()=> "a node for extracting object attributes",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },

    //!!!!TODO - can we resolve ptypes prior to passing in here???  this can then do what it needs against node, but first stage of resolution
    //could be done by nodelib!? 

    schemafn:(nid, node={}, inputs=[])=>{ 

        const filters = node.filters || [];

        const ptypes = inputs.reduce((acc,input)=>{    
            if (input.schema && input.schema.output && input.schema.output.ptype){
              acc[nid] = [
                    ...(acc[nid] || []),  
                    ...Object.keys(input.schema.output.ptype).reduce((acc,key)=>{
                        return [...acc,  ..._matches(nid,filters,key,input.schema.output.ptype[key])]
                    },[])
              ]
            }
            return acc;
        },{})

        const filtered = (ptypes[nid] || []).filter((item)=>{
           
            if (!item.conditions || item.conditions.length <= 0) 
                return true

            if (item.ordinal === "primary")
                return true;

            const attributeconditions = item.conditions.filter(i=>i.type=="attribute");

            if  (attributeconditions.length <= 0){
                return true;
            }

            return _conditionsmet(attributeconditions, ptypes[nid].filter(i=>i.ordinal==="primary" && i.type!="identifier"));
        });

        const filteredptypes = {
            ...ptypes,
            [nid] : filtered,
        }

        const items = filters.reduce((acc, filter)=>{
            
            const {sid, item:{type, name, description}, path} = filter;

            return [...acc, {
                type : "object",
                description: "container object",
                id: sid,
                properties : {
                    [`${sid}.${path.join(".")}`] : {
                        type: type,
                        description: description,
                    }
                }
            }]
        },[]);


        return {
            input:{
                type: "any",
                description: "extract will take ANY object as input"
            },
            output: {
                type: "object",
                description: "container object",
                properties: {
                    name: {type:'string', description: "a name assigned to this node"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    payload : {
                        type:"array", 
                        description:"extracted attributes", 
                        items: items,
                    }
                },
                ptype: filteredptypes,
            }
        }
    },

    risk: (node={})=>{
      return {
          score: 0,
          reason: "no risk in extracting data from an object"
      }        
    },

    descriptionfn: (values)=>{
        return `<p>This node will take an incoming message and then pull out specific values from it adn places them in the payload of the output message.</p>
                <p>It is a simple way of removing all data from a message that is of no use further down the flow </p>`;
    }
    
}

export default {
    type:     "extract",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"extract"}),
    node:     Node,
}