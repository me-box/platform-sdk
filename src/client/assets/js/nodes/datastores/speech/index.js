import Node from "./node";

const config = {
    
    category: 'datastores',      
    
    color: '#ffcc00',
    
    defaults: {             
        name: {value:""},   
        subtype: {value:"english"},

    },
    
    schemakey: "subtype",

    inputs:0,               
    
    outputs:1,             
   
    icon: "fa-microphone",
    
    unicode: '\uf130',     
    
    label: function() {     
        return this.name||this.topic||"speech";
    },
    
    schemafn: (subtype)=>{
        const type = subtype || "speech";
    

        return {
            output:{
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this speech node"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    type:{type: 'string', description: `the type:\'speech\'`},
                    subtype: {type: 'string', description: `speech language:\'${type}\'`},
                    payload: {
                      type: 'string', description: 'speech-to-text value', 
                    }
                },
                ptype: []
            }
        }
    },

    descriptionfn:(subtype)=>{
        switch(subtype){
            default:
                return "extracted speech from browser microphone.  This uses the google speech API";
        }
    } 
}

export default {
    type:     "speech",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"speech"}),
    node:     Node,
}