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

  schemafn: (nid, node) => {

    const type = node.subtype || "loadavg1";

    const _descriptions = {
      loadavg1: "a load average value for the last minute",
      loadavg5: "a load average value for the last 5 minutes",
      loadavg15: "a load average value for the last 15 minutes",
      freemem: "free memory (bytes)",
    }

    return {
      output: {
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
        required: ["id", "type", "subtype", "payload"],
        ptype: []
      }
    }
  },

  icon: "fa-terminal",
  unicode: '\uf120',

  risk: (subtype = "loadavg1") => {

    switch (subtype) {

      case "loadavg1":
      case "loadavg5":
      case "loadavg15":

        return {
          score: 1,
          reason: "no significant risk in exposing your device's system load"
        }

      case "freemem":

        return {
          score: 1,
          reason: "no significant risk in exposing your device's free RAM"
        }

      default:
        return {
          score: 0,
          reason: "unknown osmonitor subtype"
        }
    }
  },

  label: function () {
    return this.name || "osmonitor";
  },
  labelStyle: function () {
    return this.name ? "node_label_italic" : "";
  },
  descriptionfn: () => "<p>OS monitor of the databox, providing 1,5 and 15 minute load averages (a load average of 1.0 is 100% CPU utilisation on a single core machine) and free memory (bytes)</p>",
}

export default {
  type: "osmonitor",
  def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "osmonitor" }),
  node: Node,
}


