import Node from "./node";

const config = {

    category: 'datastores',

    color: '#ffcc00',

    defaults: {
        name: { value: "" },
        subtype: { value: "browserWebcamImage" },

    },

    schemakey: "subtype",

    inputs: 0,

    outputs: 1,

    icon: "fas fa-video",
    unicode: '\uf03d',

    label: function () {
        return this.name || "browserwebcam";
    },

    schemafn: (nid, node = {}) => {

        return {
            output: {
                type: "object",
                description: "the container object",
                properties: {
                    name: { type: 'string', description: "a name assigned to this webcam" },
                    payload: {
                        type: 'object',
                        description: 'the payload object',
                        properties: {
                            image: { type: 'string', description: "a string containing a representation of the image in the format specified by the type parameter" }
                        }
                    }
                },
                ptype: {
                    [nid]: [{
                        type: "identifier",
                        ordinal: "secondary",
                        description: "images can be used to identify individuals",
                        required: ["payload.image"],
                        accretion: false,
                        status: "inferrable",
                    },
                    {
                        type: "personal",
                        subtype: "physical",
                        ordinal: "secondary",
                        status: "inferable",
                        description: "images can be used to infer your age",
                        required: ["payload.image"],
                        accuracy: 0.8,
                        conditions: [
                            {
                                type: "granularity",
                                granularity: { threshold: 2, unit: "megapixel" }
                            },
                        ],
                        accretion: false,
                    }]
                }
            }
        }
    },

    risk: (subtype = "") => {
        return {
            score: 5,
            reason: "this datastore provides access to webcam video"
        }
    },

    descriptionfn: (subtype) => {
        return "a browser webcam";
    }
}


/*
*/
export default {
    type: "browserwebcam",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "browserwebcam" }),
    node: Node,
}