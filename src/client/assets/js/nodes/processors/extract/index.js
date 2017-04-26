import Node from "./node";

const config = {
    category: 'processors',    
    color: '#002255',
    
    defaults: {             
        name: {value:""},
        filters: {value:[]},
    },

    schemakey: "filters",
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-hand-o-up",    
    unicode: '\uf0a6',    
    label: function() {     
        return this.name||this.topic||"function";
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
                    output: {
                        name: {type:'string', description: "a name assigned to this node"}, 
                        id:  {type:'string', description: "the node id: [id]"},
                        msg: {
                            type: "object",
                            description: "the container object",
                            properties: {
                                payload: {
                                    type: "object",
                                    description: "the message payload",
                                    properties: payload,
                                }
                            }
                        }
                    }
                }
    },

    descriptionfn: (filters)=>{
        return "pulls out specific data from incoming data";
    }
    
}

export default {
    type:     "extract",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"extract"}),
    node:     Node,
}