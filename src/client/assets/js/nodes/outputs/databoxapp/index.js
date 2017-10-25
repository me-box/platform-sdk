import Node from "./node";
import {reducer} from "./reducer";

const config = {
  category: 'outputs',
  color: '#d45500',
  defaults: {
    name: {
      value: ""
    },
    appId: {
      value: "webapp"
    },
    layout: {
      value: null
    },
  },
  inputs: 1,
  outputs: 0,

  icon: "fa-mobile",
  unicode: '\uf10b',
  label: function() {
    return this.name || this.topic || "databox app";
  },

  schemafn: () => {

    const _descriptions = [
      {
        type: "object",
        description: "format for gauge chart",
        key: "type",
        value: "gauge",
        properties: {
          options: {
            type: "object",
            description: "chart options",
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
            description: "chart data",
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
        }
      },
      {
        type: "object",
        description: "format for bar chart",
        key: "type",
        value: "chart",
        properties: {
          options: {
            type: "object",
            description: "chart options",
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
        }
      },
      {
        type: "object",
        description: "format for text",
        key: "type",
        value: "text",
        properties: {
          values: {
            type: "string",
            description: 'some text'
          }
        }
      },
      {
        type: "object",
        description: "format for list",
        key: "type",
        value: "list",
        properties: {
          values: {
            type: "object",
            description: "list values",
            properties: {
              timestamp: {
                type: "ts",
                description: "a unix timestamp"
              },
              keys: {
                type: "array",
                description: "['key1','key2', '..']"
              },
              rows: {
                type: "object",
                properties: {
                  key: {
                    type: "any",
                    description: "key value pair where key matches key in keys array"
                  }
                }
              }
            }
          }
        }
      },
    ];

    return {
      input: {
        type: "object",
        description: "container object",
        properties: {
          sourceId: {
            type: 'string',
            description: '<i>[selectedid]</i>'
          },
          type: {
            type: 'string',
            description: "one of either \'text\', \'gauge\', \'bar\', \'list\' or \'uibuilder\'",
            enum: ["text", "gauge", "bar", "list", "uibuilder"]
          },
          payload: {
            type: 'oneof',
            description: 'the message payload',
            oneOf: _descriptions.map((item) => {
              return item;
            }),

          }
        }
      }
    }
  },

  risk: (subtype="")=>{
      return {
          score: 2,
          reason: "processed information will be displayed on a webapp which is available to users on your network"
      }        
  },

  descriptionfn: () => `<p>This component will display data on the databox UI for this app. It can render text, bar and gauge charts, svg visualisations and html.  The <strong>chartify, webify, listify and uibuilder </strong> nodes can feed directly into this node.</p> 
                        <p>The layout for each input into this node can be configured by double clicking on it.  Each input is represented as a grey box (with the id of the node or its name).  You can drag the boxes around into rows / columns to adjust layout of each node in the UI</p>`,

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  }
};

export default {
    type:     "app",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"app"}),
    node:     Node,
    reducer,
}