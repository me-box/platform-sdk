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
            "bulb-bri": {type: "number",description: "a brightness value (0-255)"},
            
            "hue-ZLLTemperature" : {
                type: "object", 
                description: "hue sensor temperature value",
                properties: {
                    "temperature":  {
                        type:"number", 
                        description:"hue light temperature value (2000-6500)"
                    },
                    "lastupdated": {
                        type: "string",
                        description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS"
                    }
                }
            },

            "hue-ZLLPresence" : {
                type: "object", 
                description: "hue sensor presence indicator",
                properties: {
                    "presence":  {
                        type:"boolean", 
                        description:"true if presence detected, false otherwise"
                    },
                    "lastupdated": {
                        type: "string",
                        description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS"
                    }
                }
            },

            "hue-ZLLLightLevel": {
                type: "object", 
                description: "hue sensor light indicator",
                properties: {
                    "lightlevel" : {type: "number",description: "a lux value"},
                    "dark" : {type: "boolean", description: "true  if dark, false otherwise"},
                    "daylight" : {type: "boolean", description: "true  if daylight, false otherwise"},
                    "lastupdated": {
                        type: "string",
                        description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS"
                    }
                }
            }
        }
      
        return {
            output:{
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this bulb"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    type:{type: 'string', description: `the type:\'bulbs-in\'`},
                    subtype: {type: 'string', description: `reading type:\'${type}\'`},
                    testarray: {    
                                    type: 'array', 
                                    description: `testing an array for mapping`, 
                                    items: {
                                        type: "object", 
                                        properties:{
                                            name: {
                                                type:"string"
                                            },
                                            value:{
                                                type:"number"
                                            }
                                        }
                                    }
                                },
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

    risk: (subtype="bulb-on")=>{

        switch(subtype){

            case "bulb-on":
                return {
                    score: 2,
                    reason: "knowing which bulbs are on or off could reveal information about room/household occupancy"
                }

            case "bulb-hue":
                return {
                    score: 1,
                    reason: "little risk associated with revealing a bulb's hue value"
                }

            case "bulb-bri":
                return {
                    score: 1,
                    reason: "little risk associated with revealing a bulb's brightness"
                }

            case "hue-ZLLTemperature":
                return {
                    score: 1,
                    reason: "little risk associated with revealing a bulb's temperature"
                }

            case "hue-ZLLPresence":
                return {
                    score: 3,
                    reason: "indication of presence can be revealing, dependent on sensor placement"
                }

            case "hue-ZLLLightLevel":
                return {
                    score: 1,
                    reason: "little risk associated with revealing a hue sensor's light level"
                }

            default: 
                return {
                    score: 0,
                    reason: "unknown bulb subtype"
                }

        }   
        
    },

    descriptionfn:(subtype)=>{
        const chosen = `<h3> ${subtype} </h3>`

        switch(subtype){
            case "bulb-on":
                return `${chosen} This will to determine whether a Philips Hue bulb is currently on or off`;
            case "bulb-hue":
                return `${chosen} This will provide a Philips Hue bulb's hue setting which ranges from 0 to 360`;
            case "bulb-bri":
                return `${chosen} This will access the Philips Hue bulb's brightness setting, which ranges from 0 to 255`;
            case "hue-ZLLTemperature":
                return `${chosen} This will acccess a hue sensor's temperature value (2000-6500)`;
            case "hue-ZLLPresence":
                return `${chosen} This will provide a presence indicator (true or false)`;
            case "hue-ZLLLightLevel":
                return `${chosen} This will provide a hue sensor light level value (in lux)`;  
            default:
                return "unknown setting";
        }
    } 
}

export default {
    type:     "bulbsin",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"bulbsin"}),
    node:     Node,
}