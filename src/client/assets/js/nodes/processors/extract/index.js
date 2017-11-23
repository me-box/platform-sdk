import Node from "./node";

const config = {
    category: 'processors',    
    color: '#3771C8',
    
    defaults: {             
        name: {value:""},
        filters: {value:[]},
        previousinputs: {value: []}
    },

    schemakey: "filters",
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-hand-o-up",    
    unicode: '\uf0a6',    
    label: function() {     
        return this.name||this.topic||"extract";
    },
    
    description: ()=> "a node for extracting object attributes",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },

    schemafn:(filters)=>{
       
        const payload = filters.reduce((acc,filter)=>{
            const {name, type, description} = filter.item;
            acc[name] = {type,description}
            return acc; 
        },{});

    
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
                                                type:"object", 
                                                description:"extracted attributes", 
                                                properties: payload
                            }
                        }
                    }
                }
    },

    risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk in extracting data from an object"
      }        
    },

    descriptionfn: (filters)=>{
        return `<p>This node will take an incoming message and then pull out specific values from it adn places them in the payload of the output message.</p>
                <p>It is a simple way of removing all data from a message that is of no use further down the flow </p>`;
    }
    
}

export default {
    type:     "extract",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"extract"}),
    node:     Node,
}