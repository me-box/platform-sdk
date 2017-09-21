import Node from "./node";

 const _luxvalues = [
    {
      value: "0.0001",
      description: "Moonless, overcast night sky (starlight)"
    },
    {
      value: "0.002",
      description: "Moonless clear night sky with airglow"
    },
    {
      value: "0.05–0.36",
      description: "Full moon on a clear night"
    },
    {
      value: "3.4",
      description: "Dark limit of civil twilight under a clear sky"
    },
    {
      value: "20-50",
      description: "Public areas with dark surroundings"
    },
    {
      value: "50",
      description: "Family living room lights"
    },
    {
      value: "80",
      description: "Office building hallway/toilet lighting"
    },
    {
      value: "100",
      description: "Very dark overcast day"
    },
    {
      value: "320-500",
      description: "Office lighting"
    },
    {
      value: "400",
      description: "Sunrise or sunset on a clear day"
    },
    {
      value: "1000",
      description: "Overcast day"
    },
    {
      value: "10000-25000",
      description: "Full daylight"
    },
    {
      value: "32000-100000",
      description: "Direct sunlight"
    }
]

const _rows = _luxvalues.reduce((acc, lux)=>{
    return `${acc}<tr><td>${lux.value}</td><td>${lux.description}</td></tr>`;

},"");

const luxtable = `<table class="table table-striped table-hover"><thead><tr><th>description</th><th>lux value</th></tr></thead><tbody>${_rows}</tbody></table>`;


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
         

          return `${chosen} <p> Measures the ambient light level (illumination) in lux captured by a device camera. </p><p> The following is an indication of typical values</p>${luxtable}`;
        
        case 'bluetooth':
          return `${chosen} <p> This will return the outcomes from periodic bluetooth scans.</p>`;

        case 'accelerometer':
        case 'linear-acceleration':
        case 'magnetometer':
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

