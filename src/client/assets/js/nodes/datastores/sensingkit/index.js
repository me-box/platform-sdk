import Node from "./node";

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
                  description: 'ambient light in lux captured by a phone camera'
                },
              }
            }

          };
      }
    }

    return {
      output: {
        msg: {
          type: "object",
          description: "the container object",
          properties: schema(subtype),
        }
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
  description: (subtype) => {

    const core = "<strong>android mobile sensingkit</strong><hr/>";

    if (subtype) {
      const chosen = `<p> the current chosen sensor is <strong>${subtype}</strong>.</p>`
      switch (subtype) {

        case 'light':
          return `${core} ${chosen} <p> This will return the ambient light in lux captured by a phone camera.</p>`;
        case 'bluetooth':
          return `${core} ${chosen} <p> This will return the outcomes from periodic bluetooth scans.</p>`;

        case 'accelerometer':
        case 'linear-acceleration':
        case 'magnetometer':
        case 'gravity':
        case 'gyroscope':
        case 'rotation':
        case 'battery':
        case 'audio-level':
          return `${core} ${chosen} <p>This will return the device ${subtype} data</p>`;

        default:
          return `${core} ${chosen}`
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

