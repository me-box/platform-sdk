import Node from "./node";
import reducer from './reducer';
import { extract_ptype_from_inputs } from 'utils/utils';

const config = {
    category: 'processors',
    color: '#3771C8',
    defaults: {
        name: { value: "" },
        templatesById: { value: {} },
        templates: { value: [] },
        mappings: { value: [] },
        transformers: { value: {} },
        canvasdimensions: { value: null },
        tree: { value: {} },
    },

    inputs: 1,

    outputs: 1,

    icon: "far fa-image",

    unicode: '\uf03e',

    label: function () {
        return this.name || "uibuilder";
    },

    schemafn: (value = "", id, inputs = []) => {
        return {
            input: {
                type: "any",
                description: "extract will take ANY object as input"
            },
            output: {
                ptype: extract_ptype_from_inputs(inputs),
            }
        }
    },

    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },

    descriptionfn: () => "<p> This is a complex node that allows you to create svg animations from input data.  Outputs from this node should typically be connected to the <strong> app </strong> node. The node will take inputs from any nodes, so long as they have a defined schema (you will need to manually add a schema if you use send data to uibuilder from a <strong>dbfunction</strong> node).  The uibuilder node provides an option for you to upload your own bespoke svg graphics, which you can then connect to data to animate.  We have fixed (for now) the aspect ratio to 1400/836 (1400/900-databox toolbar height)",

    risk: (subtype = "") => {
        return {
            score: 0,
            reason: "no risk in creating visualistions using uibuilder"
        }
    },
}

export default {
    type: "uibuilder",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "uibuilder" }),
    node: Node,
    reducer
}
