import Node from "./node";
import { reducer } from "./reducer";

const config = {

    category: 'input',

    color: "#d40000",

    defaults: {
        name: { value: "inject" },
        topic: { value: "" },
        payload: {
            value: "", validate: function (v) {
                return true
            }
        },
        payloadType: { value: "date" },
        repeat: { value: "" },
        crontab: { value: "" },
        once: { value: false }
    },

    schemakey: "payloadType",

    inputs: 0,

    outputs: 1,

    icon: "fa-clock",

    unicode: '\uf017',

    label: function () {

        if (this.name) {
            return this.name;
        }
        else if (["string", "str", "num", "bool", "json"].indexOf(this.payloadType) != -1) {
            if ((this.topic !== "") && ((this.topic.length + this.payload.length) <= 32)) {
                return this.topic + ":" + this.payload;
            } else if (this.payload.length > 0 && this.payload.length < 24) {
                return this.payload;
            } else {
                return this._("inject.inject");
            }
        } else if (this.payloadType === 'date') {
            return this._("inject.timestamp")
        } else if (this.payloadType === 'flow' && this.payload.length < 19) {
            return 'flow.' + this.payload;
        } else if (this.payloadType === 'global' && this.payload.length < 17) {
            return 'global.' + this.payload;
        } else {
            return this._("inject.inject");
        }
    },

    schemafn: (nid, node={}) => {

        const subtype = node.payload || "date";

        const translate = {
            "num": { type: "numeric", description: 'a numeric value' },
            "bool": { type: "boolean", description: 'a true or false' },
            "date": { type: 'time', description: 'a unix timestamp' },
            "json": { type: 'object', description: 'an object', schema: {} },
        }

        return {
            output: {
                type: 'object',
                description: "container object",
                properties: {
                    topic: { type: 'string', description: "a string assigned to this input" },
                    _msgid: { type: 'string', description: "a unique message id" },
                    payload: translate[subtype],
                },
                required: ["payload"],
            }
        }
    },

    risk: (subtype = "loadavg1") => {

        return {
            score: 0,
            reason: "this node does not access any of your data"
        }
    },

    descriptionfn: () => "<p>This allows you to trigger an event (either once or at intervals)</p><p>The payload defaults to the current time in millisecs since 1970, but can also be set to various other javascript types.</p> <p>The repeat function allows the payload to be sent on the required schedule.</p><p>The <i>Inject once at start</i> option actually waits a short interval before firing to give other nodes a chance to instantiate properly.</p><p>The <i>Flow</i> and <i>Global</i> options allow one to inject a flow or global context value.</p> <p><b>Note: </b>'Interval between times' and 'at a specific time' uses cron. This means that 20 minutes will be at the next hour, 20 minutes past and 40 minutes past - not in 20 minutes time. If you want every 20 minutes from now - use the 'interval' option.</p><p><b>Note: </b>all string input is escaped. To add a carriage return to a string you should use a following function.</p>",

    labelStyle: function () {
        return this.name ? "node_label_italic" : "";
    },

    button: {
        onclick: function () {

        }
    },
}

export default {
    type: "inject",
    def: Object.assign({ _: (id) => { return id } }, config, { nodetype: "inject" }),
    reducer,
    node: Node,
}