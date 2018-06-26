import Node from "./node";
import {luxvalues, axisvalues, teslavalues} from "./data";


const _luxrows = luxvalues.reduce((acc, lux)=>{
    return `${acc}<tr><td>${lux.value}</td><td>${lux.description}</td></tr>`;

},"");

const luxtable = `<table class="table table-striped table-hover"><thead><tr><th>lux value</th><th>description</th></tr></thead><tbody>${_luxrows}</tbody></table>`;


const _teslarows = teslavalues.reduce((acc, tesla)=>{
    return `${acc}<tr><td>${tesla.value}</td><td>${tesla.description}</td></tr>`;

},"");

const teslatable = `<table class="table table-striped table-hover"><thead><tr><th>microtesla value</th><th>description</th></tr></thead><tbody>${_teslarows}</tbody></table>`;

const _axisrows = axisvalues.reduce((acc, axis)=>{
    return `${acc}<tr><td>${axis.x}</td><td>${axis.y}</td><td>${axis.z}</td><td>${axis.description}</td></tr>`;

},"");

const axistable = `<table class="table table-striped table-hover"><thead><tr><th>x</th><th>y</th><th>z</th><th>description</th></tr></thead><tbody>${_axisrows}</tbody></table>`;

const personal = (subtype)=>{
      
    switch (subtype) {

      case "bluetooth":
        return [
            {
              type: "identifier",
              ordinal: "secondary",
              description: "the mac address and user-provided name can be used to unambiguously identify a user",
              status: "inferred",
              //accuracy: 1,
              required: ["payload.address"],
              accretion: false,
            },
            {
              type: "personal",
              subtype: "behaviour",
              ordinal: "secondary",
              status: "inferable",
              description: "bluetooth scan information can be used to infer location",
              required: ["payload.address"],
              conditions: [
                {
                  type: "granularity",
                  granularity: {threshold: 120, unit: "seconds between scans"}
                }
              ],
              evidence: [
                "https://doi.org/10.1007/11601494_1"
              ],
              accretion: false,
            },
            {
              type: "personal",
              subtype: "relationships",
              ordinal: "secondary",
              status: "inferable",
              description: "bluetooth scan information can be used to infer social relationships",
              required: ["payload.address"],
              conditions: [
                {
                  type: "granularity",
                  granularity: {threshold: 300, unit: "seconds between scans"}
                }
              ],
              evidence: [
                "https://dl.acm.org/citation.cfm?id=2494176",
                "https://doi.org/10.1109/MPRV.2005.37"
              ],
              accretion: false,
            }
        ]

      case "accelerometer":
        return [
            {
              type: "sensitive",
              subtype: "biometric",
              ordinal: "secondary",
              status: "inferable",
              description: "mobile accelerometer data can be used to perform a gait analysis",
              
              required: ["payload.x","payload.y","payload.z"],

              evidence : ["https://doi.org/10.1089/tmj.2011.0132"],

              accuracy: 0.5,

              conditions: [
                {
                  type: "granularity",
                  granularity: {threshold: 15, unit: "Hz"}
                },
                {
                  type: "attribute",
                  attributes: ["gender"]
                }
              ],

              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "credentials",
              ordinal: "secondary",
              status: "inferable",
              description: "accelerometer data can be used to undertake keystroke logging attacks",
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              
              required: ["payload.x","payload.y","payload.z"],
              
              accuracy: 0.5,
              
              //assume all conditions must hold to continue, but attributes can only be checked if we know other data going in!
              conditions: [ 
                {
                  type: "granularity",   
                  granularity: {threshold: 25, unit: "Hz"}
                },
              
              ],
              
              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "credentials",
              ordinal: "secondary",
              status: "inferable",
              description: "accelerometer data can be used to undertake keystroke logging attacks",
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              
              required: ["payload.x","payload.y","payload.z"],
              accuracy: 0.7,
              //assume all conditions must hold to continue, but attributes can only be checked if we know other data going in!
              conditions: [ 
                {
                  type: "granularity",
                  granularity: {threshold: 25, unit: "Hz"}
                },
                
              ],
              
              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "credentials",
              ordinal: "secondary",
              status: "inferable",
              description: "accelerometer data can be used to undertake keystroke logging attacks",
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              
              required: ["payload.x","payload.y","payload.z"],

              accuracy: 0.5,
              //assume all conditions must hold to continue, but attributes can only be checked if we know other data going in!
              conditions: [ 
                {
                  type: "granularity",
                  granularity: {threshold: 15, unit: "Hz"}
                },
                {
                  type: "attribute",
                  attributes: ["vocation"]
                },
                {
                  type: "attribute",
                  attributes: ["age", "finance"]
                }
              ],
              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "location",
              ordinal: "secondary",
              status: "inferable",
              description: "accelerometer data can be used to infer a user's location",
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              
              required: ["payload.x","payload.y","payload.z"],
              
              accuracy: 0.8,

              conditions: [
                {
                  type: "granularity",    
                  granularity: {threshold: 20, unit: "Hz"}
                },
              ],
              
              accretion: false,
            }        
        ]

      case "linear-acceleration":
      case "magnetometer":
      case "gravity":
      case "gyroscope": 
        return [
            {
              type: "sensitive",
              subtype: "biometric",
              ordinal: "secondary",
              status: "inferable",
              description: `${subtype} data can be used to perform a gait analysis`,
              
              evidence : ["https://doi.org/10.1089/tmj.2011.0132"],
              
              required: ["payload.x","payload.y","payload.z"],
              
              accuracy: 0.5,
              
              conditions: [
                {
                  type: "granularity",   
                  granularity: {threshold: 20, unit: "Hz"}
                },
              ],

              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "credentials",
              ordinal: "secondary",
              status: "inferable",
              description: `${subtype} data can be used to undertake keystroke logging attacks`,
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              
              required: ["payload.x","payload.y","payload.z"],

              conditions: [
                {
                  type:"granularity",
                  accuracy: 0.5,
                  granularity: {threshold: 30, unit: "Hz"}
                },
              ],
              
              accretion: false,
            },
            {
              type: "sensitive",
              subtype: "location",
              ordinal: "secondary",
              status: "inferable",
              description: `${subtype} data can be used to infer a user's location`,
              
              evidence : ["https://dl.acm.org/citation.cfm?id=2162095"],
              required: ["payload.x","payload.y","payload.z"],

              conditions: [
                {
                  type: "granularity",
                  accuracy: 0.8,
                  granularity: {threshold: 20, unit: "Hz"}
                },
              ],
              
              accretion: false,
            }        
          ]

          case "rotation":
            return [];

          case "battery":
            return [ 
              {
                type: "personal",
                subtype: "behaviour",
                ordinal: "secondary",
                description: "battery level data can be used to surface routine behaviour",
                status: "inferable",
                conditions: [
                  {
                    type: "granularity",
                    granularity: {threshold: 600, unit: "scan frequency in seconds"}
                  }
                ],
                required: ["plugged"],
                accretion: false,
              }
            ]

          case "audio-level":
            return [
            {
              type: "personal",
              subtype: "behaviour",
              ordinal: "secondary",
              status: "inferable",
              description: "audio level analysis may be able to infer coarse behavioural characteristics (sleeping, moving, driving)",
              conditions: [
                {
                  type: "granularity",
                  granularity: {threshold: 20, unit: "Hz"}
                }
              ],
              required: ["payload.value"],
              accretion: false,
            }
          ]

          case "light":
            return [
              {
                  type: "personal",
                  subtype: "behaviour",
                  ordinal: "secondary",
                  status: "inferable",
                  description: "correlated light readings can be used to infer behaviour (e.g. media consumption)",

                  evidence: [
                      "http://ieeexplore.ieee.org/document/7456511/?arnumber=7456511"
                  ],
                  required: ["payload.value"],
                  accuracy: 0.7,

                  conditions: [
                      {
                          type: "granularity",        
                          granularity: {
                              threshold:10, 
                              unit:"Hz"
                          }
                      }
                  ],
                  accretion: false,
              },
              {
                  type: "sensitive",
                  subtype: "credentials",
                  ordinal: "secondary",
                  status: "inferable",
                  description: "correlated light readings can be used to steal banking PIN code",

                  evidence: ["https://dl.acm.org/citation.cfm?id=2666622"],
                  
                  required: ["payload.value"],
                  
                  accuracy: 0.7,
                  
                  conditions: [
                      {
                          type: "granularity",
                          
                          granularity: {
                              threshold:80, 
                              unit:"Hz"
                          }
                      }
                  ],

                  accretion: false,
              }
            ]

          default:
            return []
    }
}

const schema = (subtype) => {

  switch (subtype) {

    case "bluetooth":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },

        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            name: {
              type: 'string',
              description: 'user assigned name of the device, \`none\' if not provided'
            },
            address: {
              type: 'string',
              description: 'the mac address of the device in the form aa:bb:cc:dd:ee:ff'
            },
            rssi: {
              type: 'number',
              description: 'received signal strength indicator (a measure of the signal strength measured by the scanning device)'
            },
          }
        }
      };


    case "accelerometer":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },

        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            x: {
              type: 'number',
              description: 'the x axis value, vigorous shaking will range from (-38 to 38)',
              minimum: -38,
              maximum: 38
            },
            y: {
              type: 'number',
              description: 'the y axis value, vigorous shaking will range from (-38 to 38)',
              minimum: -38,
              maximum: 38
            },
            z: {
              type: 'number',
              description: 'the z axis value, vigorous shaking will range from (-38 to 38)',
              minimum: -38,
              maximum: 38
            },
          }
        }
    };


    case "linear-acceleration":
    case "magnetometer":
    case "gravity":
    case "gyroscope":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },

        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            x: {
              type: 'number',
              description: 'the x axis value'
            },
            y: {
              type: 'number',
              description: 'the y axis value'
            },
            z: {
              type: 'number',
              description: 'the z axis value'
            },
          }
        }
      };

    case "rotation":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },
        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            x: {
              type: 'number',
              description: 'rotation axis xcomponent*sin(theta/2) where theta is the angle of rotation'
            },
            y: {
              type: 'number',
              description: 'rotation axis ycomponent*sin(theta/2) where theta is the angle of rotation'
            },
            z: {
              type: 'number',
              description: 'rotation axis zcomponent*sin(theta/2) where theta is the angle of rotation'
            },
            cos: {
              type: 'number',
              description: 'cosine of the angle of rotation'
            },
            headingAccuracy: {
              type: 'number',
              description: 'estimated accuracy in radians'
            },
          }
        }
      };


    case "battery":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },
        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            charge: {
              type: 'number',
              description: 'is a number from 0 to maximum battery level'
            },
            temperature: {
              type: 'number',
              description: 'is the current battery temperature'
            },
            voltage: {
              type: 'number',
              description: 'current battery voltage'
            },
            plugged: {
              type: 'string',
              description: 'possible values: [usb, ac, wireless,unknown]'
            },
            status: {
              type: 'string',
              description: 'possible values: [charging, discharging, full, not charging, unknown,unsupported]'
            },
            health: {
              type: 'string',
              description: 'possible values: [cold, dead, good, over heat, over voltage, unknown, failure, unsupported]'
            },
          }
        }
      };

    case "audio-level":
      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: `<i>${subtype}</i>`
        },
        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            value: {
              type: 'number',
              description: 'the audio level captured by the phone microphone'
            },
          }
        }
      };

    default:

      return {

        name: {
          type: 'string',
          description: 'the name of the node, defaults to \'sensingkit\''
        },
        id: {
          type: 'string',
          description: '<i>[id]</i>'
        },
        type: {
          type: 'string',
          description: '<i>sensingkit</i>'
        },
        subtype: {
          type: 'string',
          description: '<i>light</i>'
        },
        payload: {
          type: 'object',
          description: 'the message payload',
          properties: {
            ts: {
              type: 'number',
              description: 'a unix timestamp'
            },
            value: {
              type: 'number',
              description: `Measures the ambient light level (illumination) in lux captured by a device camera (0-100000) (see description to get an indication what the values mean)`
            },
          }
        }
      };
  }
};

const ptype = (nid,node={})=>{

    const subtype = node.subtype || "";

    return {[nid]:personal(node.subtype).filter((ptype)=>{
      if (!ptype.conditions)
        return true;
      return (ptype.conditions).reduce((acc,item)=>{
        return acc || item.granularity && (item.granularity.threshold <= node.granularity);
      },false);
    })};
};

const config = {
  
  category: 'datastores',
  
  color: '#ffcc00',


  defaults: {
    name: {
      value: ""
    },
    type: {
      value: "sensingkit"
    },
    subtype: {
      value: "light"
    },
    granularity: {
      value: 10,
    }
  },

  schemafn: (nid, node={}) => {
   
    const subtype = node.subtype || "";
    
    //TODO: incorporate anyOf, allOf, not (from json.schema) for required!
    //[] implictly means all of!
    return {
      output: {
          type: "object",
          description: "the container object",
          properties: schema(node.subtype),
          ptype: ptype(nid,node),
      }
    }
  },

  risk: (node={})=>{
    const subtype = node.subtype || "light";

    switch(subtype){
    
      case "bluetooth":
        return {
          score: 2,
          reason: "bluetooth scans can reveal other devices in close proximity and could be used to fingerprint location",
        }     

      case "accelerometer":
      case "linear-acceleration":
      case "magnetometer":
      case "gravity":
      case "gyroscope":
      case "rotation":
        return {
          score: 2,
          reason: `the ${subtype} sensor can reveal information about the movement of a person carrying the device`,
        }  

      case "battery":
        return {
          score: 2,
          reason: "the battery sensor can reveal limited information about a user's habits (i.e. when they charge their phone)",
        } 

      case "audio-level":
        return {
          score: 2,
          reason: "the audio-level sensor can reveal how loud the environment is that a user is/was in"
        } 
      
      case "light":
        return {
          score: 1,
          reason: "assuming the camera on the device is uncovered, the light lux reading could give coarse grained information on the kind of environment a user is in (i.e. inside,outside) "
        } 

      default:
        return {
          score: 0,
          reason: "unknown sensingkit subtype"
        } 

    }
  },

  inputs: 0,
  outputs: 1,

  icon: "fa-android",
  unicode: '\uf17b',
  label: function() {
    return this.name || "sensingkit";
  },
  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  },
  descriptionfn: (node={}) => {
  
    const subtype = node.subtype;

    if (subtype) {
      const chosen = `<h3> ${subtype} </h3>`
      switch (subtype) {

        case 'light':
         

          return `${chosen} <p> Measures the ambient light level (illumination) in lux captured by a device camera. The following is an indication of value ranges</p>${luxtable}`;
        
        case 'bluetooth':
          return `${chosen} <p> This will return the outcomes from periodic bluetooth scans.</p>`;

        case 'accelerometer':
          return `${chosen} <p>This will return the device ${subtype} data. The following is an indication of value ranges</p>${axistable}`;
      
        case 'magnetometer':
           return `${chosen} <p> All values are in micro-Tesla (uT) and measure the ambient magnetic field in the X, Y and Z axis.The following is an indication of value ranges</p>${teslatable}`;
        
        case 'linear-acceleration':
        case 'gravity':
        case 'gyroscope':
        case 'rotation':
        case 'battery':
        case 'audio-level':
          return `${chosen} <p>This will return the device ${subtype} data</p>`;

        default:
          return `${chosen}`
      }
    }
    return "";

  }
};

export default {
    type:     "sensingkit",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"sensingkit"}),
    node:     Node,
}

