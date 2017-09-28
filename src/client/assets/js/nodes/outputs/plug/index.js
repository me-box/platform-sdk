import Node from './node';

const config = {
  category: 'outputs',
  color: '#d45500',
  defaults: {
    name: {
      value: ""
    },
    subtype: {
      value: "TP-SetPowerState"
    },
    value: {
      value: "on"
    },
  },
  inputs: 1,
  outputs: 0,

  icon: "fa-plug",
  unicode: '\uf1e6',
  label: function() {
    return this.name || "plugout";
  },

  schemafn: (subtype) => {
    return {
      input: {
        type: "object",
        description: "container object",
        properties: {
          payload: {
            type: 'string',
            description: `<i> on </i> or <i> off </i>`
          }
        },
        required: ["payload"]
      }
    }
  },

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  },
  descriptionfn: () => "<p> turn a plug on or off </p>",
};


export default {
  type: "plugout",
  def: Object.assign({
    _: (id) => {
      return id
    }
  }, config, {
    nodetype: "plugout"
  }),
  node: Node,
}