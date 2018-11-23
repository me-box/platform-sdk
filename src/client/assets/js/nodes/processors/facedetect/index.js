import Node from "./node";
import { extract_ptype_from_inputs } from "utils/utils";

const ptype = (nid = "", inputs = []) => {

    const incoming = extract_ptype_from_inputs(inputs, nid)[nid];
    return {
        [nid]: [
            {
                type: "identifier",
                ordinal: "secondary",
                description: "images can be used to identify individuals",
                required: ["payload.image"],
                accretion: false,
                status: "inferred",
            },
        ]
    }
}

const config = {

    category: 'processors',
    color: '#3771C8',

    defaults: {
        name: { value: "" },
    },

    inputs: 1,

    outputs: 1,

    icon: "far fa-meh-blank",

    unicode: '\uf5a4',

    label: function () {
        return this.name || "facedetect";
    },

    description: () => "a node for extracting user's faces from input data",

    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },

    //need input ptypes??  might be nice - so provide browsing, x,y,z

    schemafn: (nid = "", node={}, inputs = []) => {

        return {
            output: {
                type: "object",
                description: "container object",
                properties: {
                    name: { type: 'string', description: "a name assigned to this node" },
                    payload: {
                        type: 'number',
                        description: "integrity value from 0 (no integrity) to 100 (max integrity)",
                    }
                },
                status: "inferred",
                ptype: ptype(nid, inputs),
                //{..._ptype, [nid] : [...(_ptype[nid]||[]), ...ptype(nid,inputs)]}
            }
        }
    },

    risk: (subtype = "") => {
        return {
            score: 3,
            reason: "locates faces in images"
        }
    },

    descriptionfn: (name) => {
        return "extracts faces from input data";
    }

}

export default {
    type: "facedetect",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "facedetect" }),
    node: Node,
}