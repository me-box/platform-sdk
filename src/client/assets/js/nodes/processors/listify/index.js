import Node from "./node";

const config = {
  category: 'processors',
  color: '#3771C8',
  defaults: {
    name: {
      value: ""
    },
  },
  schemakey:"name",
  inputs: 1,
  outputs: 1,

  icon: "fa-list",
  unicode: '\uf03a',

  label: function() {
    return this.name || this.topic || "listify";
  },

  schemafn: (subtype="", ptype={}) => {

    

    const schema = {
      output: {
          type: "object",
          description: "the container object",
          properties: {
            sourceId: {
              type: "string",
              description: "<i>[id]</i>"
            },
            type: {
              type: "string",
              description: "<i>list</i>"
            },
            payload: {
              type: "object",
              description: "values to be rendered as a list",
              properties: {
                timestamp: {
                  type: "ts",
                  description: "a unix timestamp"
                },
                keys: {
                  type: "array",
                  description: "['key1','key2', '..']",
                  items: {
                    type: "string"
                  }
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
              },
              
              required: ["timestamp", "keys", "rows"]
            }
          },
          ptype: Object.keys(ptype).reduce((acc,key)=>{
                return [  ...acc, 
                          ...ptype[key].map((i)=>{
                              return {
                                ...i, 
                                required:["payload.rows.key"]
                              }
                          })
                        ]
          },[]),
          required: ["sourceId", "type", "payload"]
      },
      input: {
        type: "object",
        description: "the container object",
        properties: {
          payload: {
            type: "object",
            description: "the payload object",
            properties: {
              id: {
                type: "string",
                description: "a unique id"
              },
              values: {
                type: "object",
                description: "the container object",
                properties: {
                  key: {
                    type: "any",
                    description: "a key:value object where value is a primitive type (string,number)"
                  }
                },
              },
              required: ["id", "values"]
            }
          }
        },
        required: ["payload"]
      }
    };

    console.log("ok in listify and returning schema", schema);

    return schema;
  },

  risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk in formatting data into a list"
      }        
  },

  descriptionfn: () => "<h3>listify</h3>This node will typically connect to the <strong>app</strong> output node.  It takes data from the <strong>payload</strong> of a message and displays it as a table, with the headings the attribute names",

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  }
}


export default {
  type: "listify",
  def: Object.assign({_: (id) => {return id}}, config, {nodetype: "listify"}),
  node: Node,
}