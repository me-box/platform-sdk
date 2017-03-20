import Node from "./node";

const config = {
    
    category: 'datastores',      
    
    color: '#ffcc00',
    
    defaults: {             
        name: {value:""},   
        subtype: {value:"bulb-on"},

    },
    
    schemakey: "subtype",

    inputs:0,               
    
    outputs:1,             
   
    icon: "fa-lightbulb-o",
    
    unicode: '\uf0eb',     
    
    label: function() {     
        return this.name||this.topic||"bulbsin";
    },
    
    schemafn: (subtype)=>{
        const type = subtype || "bulb-on";
      
        const payloads = {
            "bulb-on": {type: "string", description: "<i>on</i> or <i>off</i>"},
            "bulb-hue": {type: "number", description: "a hue value (0-360)"},
            "bulb-bri": {type: "number",description: "a brightness value (0-255)"}
        }
      
        return {
            output:{
              msg: {
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this bulb"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    type:{type: 'string', description: `the type:\'bulbs-in\'`},
                    subtype: {type: 'string', description: `reading type:\'${type}\'`},
                    payload: {
                      type: 'object', 
                      description: 'the payload object', 
                      properties: {
                        ts: {type:'time', description: 'a unix timestamp'},
                        value: payloads[type],          
                      },
                      required: ["ts", "value"]
                    }
                  },
                  required: ["id", "type", "subtype", "payload"]
                }
            }
        }
    } 
}

export default {
    type:     "bulbsin",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"bulbsin"}),
    node:     Node,
}