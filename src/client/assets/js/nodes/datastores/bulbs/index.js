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

        const personal = (type)=>{
             switch (type){
            
                case "bulb-on": 
                     return [
                                type: "personal",
                                subtype: "behaviour",
                                ordinal: "secondary",
                            
                                description: "bulb on/off data can provide an indicator of routine and room occupancy",
                                required: ["payload.value"],
                                conditions: [
                                    {
                                        accuracy: 0.9,
                                        granularity: {threshold:-1, unit:"none"}
                                    }
                                ],

                                accretion: true
                            ]

                case "bulb-hue":
                    return [];

                case "bulb-bri":
                    return [];

                case "hue-ZLLTemperature":
                    return [
                        type: "personal",
                        subtype: "consumption",
                        ordinal: "secondary",
                        required: ["payload.temperature"],
                        description: "temperature data can provide an indicator of routine and room occupancy",
                        required: ["payload.value"],
                        conditions: [
                            {
                                accuracy: 0.4,
                                granularity: {threshold:1, unit:"samples per minute"}
                            }
                        ],

                        accretion: true,
                    ];

                case "hue-ZLLPresence":
                    return [ 
                            {
                                type: "personal",
                                subtype: "behaviour",
                                ordinal: "secondary",
                                
                                description: "presence data can provide an indicator of routine and room occupancy",
                                required: ["payload.value"],

                                conditions: [
                                    {
                                        accuracy: 0.9,
                                        granularity: {threshold:-1, unit:"none"}
                                    }
                                ],

                                accretion: true,
                            },
                            {
                                type: "personal",
                                subtype: "location",
                                ordinal: "secondary",
                                required: ["payload.value"],
                                
                                description: "presence data can provide partial location information",

                                conditions: [
                                    {
                                        granularity: {threshold:-1, unit:"none"}
                                    }
                                ],

                                accretion: true,
                            }
                        ]

                case "hue-ZLLLightLevel":
                    return [
                            {
                                type: "personal",
                                subtype: "behaviour",
                                ordinal: "secondary",
                                required: ["payload.value"],
                                description: "correlated light readings can be used to infer behaviour (e.g. media consumption)",

                                evidence: [
                                    "http://ieeexplore.ieee.org/document/7456511/?arnumber=7456511"
                                ],
                                
                                conditions: [
                                    {
                                        accuracy: 0.7,
                                        granularity: {
                                            threshold:10, 
                                            unit:"Hz"
                                        }
                                    }
                                ],
                                accretion: false,
                            }
                    ]

                default:
                    return [];


            }
        };

        const payloads = (type)=>{

            switch (type){
            
                case "bulb-on": 
                    return {
                                type: "string", 
                                description: "<i>on</i> or <i>off</i>",
                               
                            };
                
                case "bulb-hue":
                    return  {   
                                type: "number", 
                                description: "a hue value (0-360)",
                                minimum:0,
                                maximum:360
                            };

                case "bulb-bri":
                    return  {
                                type: "number",
                                description: "a brightness value",
                                minimum: 0,
                                maximum: 255
                            };

                
                case "hue-ZLLTemperature":

                    return {
                                type: "object", 
                                description: "hue sensor temperature value",
                                properties: {
                                    "temperature":  {
                                        type:"number", 
                                        description:"hue light temperature value (2000-6500)",
                                        minimum:2000,
                                        maximum:6500
                                    },
                                    "lastupdated": {
                                        type: "string",
                                        description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS",
                                        format: "date-time"
                                    }
                                }
                            };

                case "hue-ZLLPresence":
                    
                    return {
                        type: "object", 
                        description: "hue sensor presence indicator",
                        properties: {
                            "presence":  {
                                type:"boolean", 
                                description:"true if presence detected, false otherwise"
                            },
                            "lastupdated": {
                                type: "string",
                                description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS",
                                format: "date-time"
                            }
                        }
                    };

                case "hue-ZLLLightLevel": 
                    return {
                        type: "object", 
                        description: "hue sensor light indicator",
                        properties: {
                            "lightlevel" : {
                                type: "number",
                                description: "a lux value",
                                minimum:0,
                                maximum:100000
                            },
                            "dark" : {type: "boolean", description: "true  if dark, false otherwise"},
                            "daylight" : {type: "boolean", description: "true  if daylight, false otherwise"},
                            "lastupdated": {
                                type: "string",
                                description: "date string in ISO 8601 format: YYYY-MM-DDTHH:MM:SS",
                                format: "date-time",
                            }
                        }
                    }

                default:
                    return {};
            }
        };

      
        return {
            output:{
                type: "object",
                description: "the container object",
                properties:{
                    name: {type:'string', description: "a name assigned to this bulb"}, 
                    id:  {type:'string', description: "the node id: [id]"},
                    type:{type: 'string', description: `the type:\'bulbsin\'`},
                    subtype: {type: 'string', description: `reading type:\'${type}\'`, enum: ["bulb-on","bulb-hue","bulb-bri","hue-ZLLTemperature","hue-ZLLPresence","hue-ZLLLightLevel"]},
                    payload: {
                      type: 'object', 
                      description: 'the payload object', 
                      properties: {
                        ts: {type:'time', description: 'a unix timestamp'},
                        value: payloads(type),          
                      },
                      required: ["ts", "value"]
                    }
                },
                ptype: personal(type),
                required: ["id", "type", "subtype", "payload"],
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