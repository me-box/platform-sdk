import Node from "./node";

const config = {
    
    category: 'datastores',      
    
    color: '#ffcc00',
    
    defaults: {             
        name: {value:""},   
        subtype: {value:"TP-PowerState"},
    },
    
    schemakey: "subtype",

    inputs:0,               
    
    outputs:1,             
   
    icon: "fa-plug",
    
    unicode: '\uf1e6',     
    
    label: function() {     
        return this.name||this.topic||"plugin";
    },
    
    schemafn: (subtype)=>{
        const type = subtype || "TP-PowerState";
      
        const payloads = {
            
            "TP-PowerState": {
                type: "string", 
                description: "<i>on</i> or <i>off</i>"
            },

            "TP-Power-Usage": {   
                type: "number", 
                description: "power utilisation in Watts"
            }
        }
      
        return {
            output:{
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this plug"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    type:{type: 'string', description: `the type:\'plugin\'`},
                    subtype: {type: 'string', description: `reading type:\'${type}\'`, enum: ["TP-Power-Usage","TP-PowerState"]},
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
    },

    risk: (subtype="TP-Power-Usage")=>{

        switch(subtype){

            case "TP-Power-Usage":
                return {
                    score: 3,
                    reason: "knowing the power usage over time may reveal household routines/occupancy"
                }

            case "TP-PowerState":
                return {
                    score: 3,
                    reason: "knowing whether a particular plug is on or off might give some indication of occupancy"
                }

            default: 
                return {
                    score: 0,
                    reason: "unknown plug subtype"
                }

        }   
        
    },

    descriptionfn:(subtype)=>{
        const chosen = `<h3> ${subtype} </h3>`
       
        switch(subtype){
            
            case "TP-PowerState":
                return `${chosen} This will to determine whether a TP-Link plug is on or off`;
            case "TP-Power-Usage":
                return `${chosen} This will provide the current power rating of the TP-Link plug`;
            default:
                return "unknown setting";
        }
    } 
}

export default {
    type:     "plugin",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"plugin"}),
    node:     Node,
}