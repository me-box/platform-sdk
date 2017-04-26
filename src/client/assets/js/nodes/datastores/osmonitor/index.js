import Node from "./node";

const config = {
  category: 'datastores',
  color: '#ffcc00',

  defaults: {
    name: {
      value: ""
    },
    type: {
      value: "osmonitor"
    },
    subtype: {
      value: "loadavg1"
    },
  },
  schemakey: "subtype",
  inputs: 0,
  outputs: 1,

  schemafn: (subtype) => {

    const type = subtype || "loadavg1";

    const _descriptions = {
      loadavg1: "a % value for the last minute system load",
      loadavg5: "a % value for the last 5 minutes system load",
      loadavg15: "a % value for the last 15 minutes system load",
      freemem: "free memory (bytes)",
    }

    return {
      output: {
        msg: {
          type: "object",
          description: "the container object",
          properties: {
            name: {
              type: 'string',
              description: "a name assigned to this monitor"
            },
            id: {
              type: 'string',
              description: "the node id: [id]"
            },
            type: {
              type: 'string',
              description: `the type:'osmonitor'`
            },
            subtype: {
              type: 'string',
              description: `reading type:'${type}'`
            },
            payload: {
              type: 'object',
              description: 'the payload object',
              properties: {
                ts: {
                  type: 'time',
                  description: 'a unix timestamp'
                },
                value: {
                  type: 'number',
                  description: _descriptions[type] || ""
                },
              },
              required: ["ts", "value"]
            },
          },
          required: ["id", "type", "subtype", "payload"]
        }
      }
    }
  },

  icon: "fa-terminal",
  unicode: '\uf120',
  label: function() {
    return this.name || "osmonitor";
  },
  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  },
  descriptionfn: () => "<p>OS monitor of the databox, providing 1,5 and 15 minute load averages (percentages) and free memory (bytes)</p>",
}

export default {
    type:     "osmonitor",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"osmonitor"}),
    node:     Node,
}


