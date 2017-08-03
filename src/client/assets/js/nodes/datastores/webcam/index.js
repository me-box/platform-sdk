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
                    image: {type: 'binary', description: "a webcam image"},
                },
            }
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