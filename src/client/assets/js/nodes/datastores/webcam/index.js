import Node from "./node";

const config = {
    
    category: 'datastores',      
    
    color: '#ffcc00',
    
    defaults: {             
        name: {value:""},   
        subtype: {value:"webcam"},

    },
    
    schemakey: "subtype",

    inputs:0,               
    
    outputs:1,             
   
    icon: "fa-video-camera",
    
    unicode: '\uf03d',     
    
    label: function() {     
        return this.name||"webcam";
    },
    
    schemafn: (subtype)=>{
        return {
            output:{
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this webcam"}, 
                    dataURL: {type: 'string', description: "a string containing a representation of the image in the format specified by the type parameter"},
                },
            }
        }
    },

    risk: (subtype="")=>{
        return {
            score: 5,
            reason: "this datastore provides access to webcam video"
        }
    },

    descriptionfn:(subtype)=>{
        return "a webcam";
    }   
}

export default {
    type:     "webcam",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"webcam"}),
    node:     Node,
}