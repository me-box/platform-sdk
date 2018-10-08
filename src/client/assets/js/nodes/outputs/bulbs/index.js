import Node from "./node";

const config = {
    category: 'outputs',
    color: '#d45500',
    defaults: {
        name: { value: "" },
        subtype: { value: "set-bulb-on" },
        value: { value: "" },
    },

    schemakey: "subtype",

    inputs: 1,

    outputs: 0,

    icon: "fa-lightbulb",

    unicode: '\uf0eb',

    label: function () {
        return this.name || this.topic || "bulbs-out";
    },

    schemafn: (subtype) => {

        const type = subtype || "bulb-on";

        const _descriptions = [
            {
                key: "type",
                value: "set-bulb-on",
                type: "string",
                description: `"on" or "off"`,
            },
            {
                key: "type",
                value: "set-bulb-hue",
                type: "number",
                description: "a hue value (0-360)",
            },
            {
                key: "type",
                value: "set-bulb-brightness",
                type: "number",
                description: "a brightness value (0-255)",
            },

        ];


        return {
            input: {
                type: "object",
                description: "the container object",
                properties: {
                    type: { type: 'string', description: `one of either 'set-bulb-on', 'set-bulb-hue', 'set-bulb-brightness'`, enum: ["set-bulb-on", "set-bulb-hue", "set-bulb-brightness"] },
                    payload: {
                        type: 'oneOf', description: `'type' dependent`, oneOf: _descriptions.map((item) => {
                            return item;
                        })
                    }
                },
                required: ["type", "payload"]
            }
        }
    },

    risk: (subtype = "set-bulb-on") => {
        switch (subtype) {
            case "set-bulb-on":
                return {
                    score: 1,
                    reason: "turning a bulb on or off presents a low risk"
                }

            case "set-bulb-hue":
                return {
                    score: 1,
                    reason: "changing a bulb's hue presents a low risk"
                }

            case "set-bulb-bri":
                return {
                    score: 1,
                    reason: "changing a bulb's brightness presents a low risk"
                }

            default:
                return {
                    score: 0,
                    reason: "unknown bulb subtype"
                }

        }

    },

    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },

    descriptionfn: () => `<p> You can affect Philips Hue Bulbs in several ways with this node i.e. turn them on or off, change their hue or change brightness.</p> <p> To choose what you want to (i.e turn a bulb on or off, change its brightness or colour), you can either select the options by double clicking the node and selecting one of 'on', 'hue' or 'brightness' and provide a value, or you can just set the type and pass the value in as a message, e.g. <code> {payload: "on"} </code> to turn the bulb on, or <code> {payload: 255}</code> to set brightness.<p>  You can also set the type and value with a message (and this will override any configuration that you set) e.g. to send an off, your message would need to be <code> payload: {type:"set-bulb-on", value:"off"} </code> or to set brightness: <code>  {type:"set-bulb-brightness", value:124}</p>`
}

export default {
    type: "bulbsout",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "bulbsout" }),
    node: Node,
}
