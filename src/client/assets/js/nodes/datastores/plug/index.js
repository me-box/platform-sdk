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
    
    schemafn: (subtype, id)=>{
        const type = subtype || "TP-PowerState";
      
        const privacy = (type)=>{
            switch (type){
                
                case  "TP-PowerState": 
                    return [
                        {
                            type: "personal",
                            subtype: "behaviour",
                            ordinal: "secondary",
                            
                            description: "power on/off can be used to infer occupancy patterns",

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"}
                                }
                            ],
                            required: ["payload.value"],
                            accretion: true,
                        },
                        {
                            type: "personal",
                            subtype: "location",
                            ordinal: "secondary",
                            
                            description: "power on/off can be used to infer partial location",

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"}
                                }
                            ],
                            required: ["payload.value"],
                            accretion: true,
                        },
                    ]

                case  "TP-Power-Usage":
                    return [
                        {
                            type: "personal",
                            subtype: "consumption",
                            ordinal: "secondary",
                            
                            description: "current drawn over time can give a (partial) indication of energy consumption",

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"},
                                }
                            ],

                            required: ["payload.value.current"],

                            accretion: true,
                        },
                        {
                            type: "personal",
                            subtype: "consumption",
                            ordinal: "secondary",
                            
                            description: "voltage measured across your device can give a (partial) indication of energy consumption",

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"},
                                }
                            ],

                            required: ["payload.value.voltage"],

                            accretion: true,
                        },
                         {
                            type: "personal",
                            subtype: "consumption",
                            ordinal: "secondary",
                            
                            description: "power usage will give a (partial) indication of energy consumption",

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"},
                                }
                            ],

                            required: ["payload.value.power"],

                            accretion: true,
                        },
                        {
                            type: "personal",
                            subtype: "employment-status",
                            ordinal: "secondary",
                            
                            description: "power usage can be used to infer employment status",

                            evidence: ["https://www.sciencedirect.com/science/article/pii/S0198971516300813","https://dl.acm.org/citation.cfm?id=2422562"],

                            conditions: [
                                {
                                    granularity: {threshold:0.01, unit:"Hz"}
                                }
                            ],
                            required: ["payload.value.power"], //need a strcuture of ors and ands
                            accretion: true,
                        }
                    ]
                default: 
                    return {}
            }
        }

        const payloads = (type)=>{
            
            switch (type){
             
                case  "TP-PowerState": 
                    return {
                        type: "string", 
                        description: "<i>on</i> or <i>off</i>",
                    }

                case "TP-Power-Usage": 
                    return {   
                        type: "object", 
                        description: "values for current, voltage, power and total",
                        properties: {
                            current : {
                                type: "number",
                                desciption: "the reading for current (amps)"
                            },
                            voltage: {
                                type: "number",
                                desciption: "the reading for voltage (V)"
                            },
                            power : {
                                type: "number",
                                desciption: "the reading for power (W)"
                            }
                        }
                    }
                default:
                    return {}
            }
        };

      
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
                        value: payloads(type),          
                      },
                      required: ["ts", "value"]
                    }
                },
                ptype : {
                    [id] : privacy(type)
                },
                required: ["id", "type", "subtype", "payload"],
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