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

  schemafn: () => {
    return {
      input: {
        type: "object",
        description: "container object",
        properties: {
          payload: {
            type: 'string',
            description: "on or off",
            enum: ["on", "off"]
          }
        },
        required: ["payload"]
      }
    }
  },

  risk:(subtype="")=>{
     return {
        score: 4,
        reason: "this node can turn plugs on and off"
     }
  },

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  },
  descriptionfn: () => `<p> Use this node to turn a TP-Link smart plug on or off.</p><p>  Send a <code>{payload:"on"}</code> to turn it on and a <code>{payload:"off"}</code> to turn it off</p>`,
};


export default {
  type: "plugout",
  def: Object.assign({_: id=>id}, config, {nodetype: "plugout"}),
  node: Node,
}