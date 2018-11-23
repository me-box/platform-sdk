import Node from "./node";

const config = {

    category: 'processors',    
    
    color: '#3771C8',
    
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

    schemafn:()=>{

        return {
                    output: {
                        type: "object",
                        description: "container object",
                        properties: {
                            name: {type:'string', description: "a name assigned to this node"}, 
                            payload: {
                                    type:'object', 
                                    description: "an identity and location of face as a point", 
                                    properties: {
                                        name: {
                                            type: "string",
                                            description: "an identity (or tag (e.g. '0', '1', '2'...) if unknown) assigned to this face"
                                        },
                                        confidence:{
                                            type: "number",
                                            description: "confidence value for face prediction"
                                        },
                                        point : {
                                            type: "object",
                                            description: "the location of the face on the image (as % values)",
                                            properties:{
                                                cx: {type:"number", description: "% left of screen for center x of point"},
                                                cy: {type:"number", description: "% top of screen for center y of point"},
                                                r: {type:"number", description: "radius of point (circling face) as % height of screen"}
                                            }
                                        }
                                    }
                            }
                        }
                    }
                }
    },

    risk: (subtype="")=>{
      return {
          score: 5,
          reason: "people can be identified through face recognition"
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