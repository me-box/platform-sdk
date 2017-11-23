import Node from "./node";

const config = {
  category: 'processors',
  color: '#3771C8',
  defaults: {
    name: {
      value: ""
    },
    title: {
      value: ""
    },
    chart: {
      value: "bar"
    },
    xlabel: {
      value: ""
    },
    ylabel: {
      value: ""
    },
    min: {
      value: ""
    },
    max: {
      value: ""
    },
    labels: {
      value: ""
    },
    maxreadings: {
      value: ""
    },
    ticks: {
      value: ""
    },
    xtype: {
      value: []
    },
    ytype: {
      value: []
    },
    subtype: {
      value: "bar"
    },
    previousinputs: {
      value: [],
    }
  },

  schemakey: "subtype",

  inputs: 1,
  outputs: 1,

  icon: "fa-bar-chart",
  unicode: '\uf080',
  
  label: function() {
    return this.name || "chartify";
  },


  schemafn: (chart) => {

    const subtype = chart || "bar";

    const _payload = {

      "bar": {
        type: "object",
        description: "the container object",
        properties: {
          options: {
            type: "object",
            description: "options for rendering the chart",
            properties: {
              title: {
                type: "number",
                description: "gauge title"
              },
              ticks: {
                type: "number",
                description: "number of values displayed on the gauge"
              },
              xlabel: {
                type: "string",
                description: "x-axis label"
              },
              ylabel: {
                type: "string",
                description: "y-axis label"
              },
              min: {
                type: "number",
                description: "minimum axis value"
              },
              max: {
                type: "number",
                description: "maximum axis value"
              },
              maxreadings: {
                type: "number",
                description: "maximum number of readings shown on chart"
              },
            }
          },
          values: {
            type: "object",
            description: "chart values",
            properties: {
              id: {
                type: "string",
                description: "id of the dataset"
              },
              type: {
                type: "string",
                description: "<i>data</i>"
              },
              dataid: {
                type: "string",
                description: "id of the data item (eg timestamp)"
              },
              x: {
                type: "number",
                description: "x value"
              },
              y: {
                type: "number",
                description: "y value"
              },
            },
            required: ["id", "type", "dataid", "x", "y"]
          }
        },
        required: ["values"]
      },

      "gauge": {
        type: "object",
        description: "the container object",
        properties: {
          options: {
            type: "object",
            description: "options for rendering the chart",
            properties: {
              title: {
                type: "number",
                description: "gauge title"
              },
              ticks: {
                type: "number",
                description: "number of values displayed on the gauge"
              },
              min: {
                type: "number",
                description: "minimum value"
              },
              max: {
                type: "number",
                description: "maximum value"
              },
              labels: {
                type: "string",
                description: "labels along the top of the chart in format name:value,name:value"
              },
            }
          },
          //TODO: get rid of non-essential attributes 
          values: {
            type: "object",
            description: "chart values",
            properties: {
              id: {
                type: "string",
                description: "id of the dataset"
              },
              type: {
                type: "string",
                description: "<i>data</i>"
              },
              dataid: {
                type: "string",
                description: "id of the data item (eg timestamp)"
              },
              x: {
                type: "number",
                description: "value being measured"
              },
            },
            required: ["id", "type", "dataid", "x"]
          }
        },
        required: ["values"]
      }
    }

    return {
      output: {
          type: "object",
          description: "the container object",
          properties: {
            type: {
              type: "string",
              description: `<i>${subtype}</i>`
            },
            sourceId: {
              type: "string",
              description: `<i>[id]</i>`
            },
            payload: {
              type: "object",
              description: "message payload",
              properties: _payload[subtype]
            }
          },
          required: ["type", "sourceId", "payload"]
      },
      input: {
        type: "object",
        description: "the container object",
        properties: {
          name: {
            type: "string",
            description: "name of the input source"
          },
          type: {
            type: "string",
            description: "type of the input source: \'gauge\' or \'bar\'",
            enum: ["gauge", "bar"]
          },
          subtype: {
            type: "string",
            description: "some sources (eg osmonitor) will have a subtype"
          },
          sensor: {
            type: "string",
            description: "sensingkit will send a sensor type"
          },
          _msgid: {
            type: "string",
            description: "a unique message id"
          },
          payload: {
            type: "object",
            description: "message payload",
            properties: {
              ts: {
                type: "ts",
                description: "unix timestamp"
              },
              value: {
                type: "any",
                description: "the value to be charted"
              },
            },
            required: ["ts", "value"]
          }
        },
        required: ["type", "subtype", "sensor", "payload"]
      },
    }
  },

  risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk with formatting data for a chart"
      }        
  },

  descriptionfn: () => "<p> This node will take in datastore data from any datastore that creates number data and display it as a chart.  Currently the two supported types of chart are <strong> bar charts </strong> and a <strong> gauge </strong> </p>",

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  }
}

export default {
    type:     "chartify",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"chartify"}),
    node:     Node,
}