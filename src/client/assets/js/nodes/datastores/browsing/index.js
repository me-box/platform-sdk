import Node from "./node";

const config = {

    category: 'datastores',
    color: '#ffcc00',

    defaults: {
        name: { value: "" },
    },
    inputs: 0,
    outputs: 1,

    schemafn: (nid, node) => {

        return {
            output: {
                type: "object",
                description: "the container object",
                properties: {
                    name: { type: 'string', description: "a name assigned to this browsing node" },
                    id: { type: 'string', description: "<i>[id]</i>" },

                    payload: {
                        type: 'object',
                        description: 'the payload object',
                        properties: {
                            ts: { type: 'time', description: 'a unix timestamp' },
                            ip: { type: 'string', description: 'ip address of browsing machine' },
                            mac: { type: 'string', description: 'mac address of browsing machine' },
                            value: { type: 'string', description: "top level domain name browsed" },
                        },
                        required: ["ts", "ip", "mac", "value"]
                    }
                },
                required: ["id", "payload"],

                ptype: {
                    [nid]: [
                        {
                            type: "identifier",
                            ordinal: "secondary",
                            description: "a user can be indirectly identified through mac address",
                            required: ["payload.ip"],
                            accretion: false,
                        },
                        {
                            type: "identifier",
                            ordinal: "secondary",
                            description: "a user can be indirectly identified through mac address",
                            required: ["payload.mac"],
                            accretion: false,
                        },
                        {
                            type: "personal",
                            category: "behaviour",
                            subtype: "browsing",
                            ordinal: "primary",
                            description: "user browsing data",
                            required: ["payload.ts", "payload.ip", "payload.value"],
                            accretion: false,
                        },
                        {
                            type: "personal",
                            category: "behaviour",
                            subtype: "browsing",
                            ordinal: "primary",
                            description: "user browsing data",
                            required: ["payload.ts", "payload.mac", "payload.value"],
                            accretion: false,
                        },
                    ]
                }
            }
        }
    },

    risk: () => {
        return {
            score: 3,
            reason: "browsing history can reveal personal information about a user",
        }
    },

    icon: "fa-desktop",
    unicode: '\uf108',
    label: function () {
        return this.name || "desktop";
    },
    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },
    descriptionfn: () => "<h3> browsing node </h3> This node will capture a device's browsing data",

}

export default {
    type: "browsing",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "browsing" }),
    node: Node,
}