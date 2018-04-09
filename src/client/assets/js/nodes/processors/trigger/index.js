import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";
const config = {
  category: 'processors',
  color: '#3771C8',
  
  defaults: {
    op1: {value:"1"},
    op2: {value:"0"},
    op1type: {value:"num"},
    op2type: {value:"num"},
    duration: {value:"250"},
    extend: {value:"false"},
    units: {value:"ms"},
    reset: {value:""},
    name: {value:""}
  },
  
  inputs:1,
  outputs:1,

  icon: "fa-heartbeat",
  unicode: '\uf21e',

  label: function() {
    return this.name || this.topic || "trigger";
  },


  schemafn: (value="", id, inputs=[]) => {

    return { 
        output:{
            type: "any",
            description: "trigger may output any object",
            ptype: extract_ptype_from_inputs(inputs),
        },
     
        input:{
            type: "any",
            description: "trigger will take ANY object as input"
        }
    }
  },

  risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk in using the trigger node"
      }        
  },

  descriptionfn: () => `<h3>trigger</h3> <p>Creates two messages on the output separated by a timeout whenever <i>any</i> <code>msg</code> arrives on the input.</p>
    <p>For example, this can be used to toggle a bulb or plug on and off.</p>
    <p>The two output states can be specified as can the duration of the timer.
    <p>If the <code>msg.payload</code> is an object then setting the output to
    <i>existing payload</i> will pass the complete payload object through.</p>
    <p>Optionally the timer can be extended by being retriggered... or not.</p>
    <p>By setting the first output to <i>nothing</i>, and selecting extend timer - a watchdog timer can be created.
    No output will happen as long as repeated inputs occur within the timeout period.</p>
    <p>Setting the timer to 0 creates an "infinite" timeout - the first output will happen but the second
    never will, and neither can the first be retriggered - so a true one shot.</p>
    <p>If a <code>msg.reset</code> property is present, or the <code>msg.payload</code>
    matches the optional reset value, any timeout currently in progress
    will be cleared and the second output will not happen.</p>`,

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  }
}


export default {
  type: "trigger",
  def: Object.assign({_: (id) => {return id}}, config, {nodetype: "trigger"}),
  node: Node,
}