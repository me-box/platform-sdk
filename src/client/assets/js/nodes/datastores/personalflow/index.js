import Node from "./node";


const config = {

    category: 'datastores',

    color: '#ffcc00',

    defaults: {
        name: { value: "" },
        subtype: { value: "personalFlow" },
    },

    schemakey: "subtype",

    inputs: 0,

    outputs: 1,

    icon: "fa-angle-right",

    unicode: '\uf105',

    label: function () {
        return this.name || "personalFlow";
    },

    schemafn: (subtype, id) => {

        return {
            output: {
                type: "object",
                description: "the container object",
                properties: {
                    name: { type: 'string', description: "a name assigned to this personal flow node" },
                    id: { type: 'string', description: "the node id: [id]" },
                    subtype: { type: 'string', description: `${subtype}` },
                    payload: {
                        type: 'object',
                        description: 'the payload object',
                        properties: {
                            appname: { type: 'string', description: 'name of the app' },
                            value: { type: 'array', description: 'paths of all personal data flowing through the app' },
                        },
                        required: ["appname", "value"]
                    }
                },
                ptype: {
                    [id]: []
                },
                required: ["id", "subtype", "payload"],
            }
        }
    },

    risk: (subtype = "") => {
        return {
            score: 5,
            reason: "shows all types of data that are flowing through the app"
        }
    },

    descriptionfn: (subtype) => {
        return "this node will output all personal data that is flowing through all SDK built apps on the databox"
    }
}

export default {
    type: "personalflow",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "personalflow" }),
    node: Node,
}