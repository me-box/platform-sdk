import Node from "./node";

const config = {

    category: 'processors',    
    
    color: '#002255',
    
    defaults: {             
        name: {value:""},
    },

    schemakey: "name",
    
    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-users",    
    
    unicode: '\uf0c0',    
    
    label: function() {     
        return this.name||"openface";
    },
    
    description: ()=> "a node for extracting face data from a video feed",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },

    schemafn:(filters)=>{

        return {
                    output: {
                        type: "object",
                        description: "container object",
                        properties: {
                            name: {type:'string', description: "a name assigned to this node"}, 
                        }
                    }
                }
    },

    descriptionfn: (name)=>{
        return "gets identities and bounding boxes for faces";
    }
    
}

export default {
    type:     "openface",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"openface"}),
    node:     Node,
}