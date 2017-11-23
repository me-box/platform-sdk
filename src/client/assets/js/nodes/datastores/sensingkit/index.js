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
  },

  schemakey: "subtype",

  schemafn: (subtype) => {

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
                  type: 'time',
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
                  type: 'time',
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
                  type: 'time',
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
                  type: 'time',
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
                  type: 'time',
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
                  type: 'time',
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
                  type: 'time',
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
    }

    return {
      output: {
          type: "object",
          description: "the container object",
          properties: schema(subtype),
      }
    }
  },

  risk: (subtype="light")=>{
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
  descriptionfn: (subtype) => {


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
    return core;

  }
};

export default {
    type:     "sensingkit",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"sensingkit"}),
    node:     Node,
}

