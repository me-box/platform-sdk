import Node from "./node";
import reducer from './reducer';
import { extract_ptype_from_inputs } from 'utils/utils';

const config = {
    category: 'processors',
    color: '#3771C8',
    defaults: {
        name: { value: "" },
        rules: { value: [] },
    },

    inputs: 1,

    outputs: 1,

    icon: "fas fa-clipboard-list",

    unicode: '\uf46d',

    label: function () {
        return this.name || "rules";
    },

    schemafn: (nid, node={}, inputs = []) => {
        return {
            input: {
                type: "any",
                description: "rules will take ANY object as input"
            },
            output: {
                ptype: extract_ptype_from_inputs(inputs),
            }
        }
    },

    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },

    descriptionfn: () => "<p> This node allows you to create outputs based on rules applied to inputs.  You can use this manipulate data without having to write code </p>",

    risk: (subtype = "") => {
        return {
            score: 0,
            reason: "no risk in creating rules"
        }
    },
}

export default {
    type: "rules",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "rules" }),
    node: Node,
    reducer
}
