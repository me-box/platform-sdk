import Node from "./node";
import {extract_ptype_from_inputs} from "utils/utils";


const _extract_keys = (inputs)=>{
  const keys = inputs.reduce((acc,input)=>{
    const schema = input.schema.output || {};
    const payload = schema.properties ? schema.properties.payload : {};
    return [...acc, {type: "array", id:input.id, description: "keys that index rows", items:Object.keys(payload.properties || {}).reduce((acc,key)=>{
        return [...acc, {type:"string", description: `key: ${key} to item: ${payload.properties[key].description}`}]
    },[])}] 
  },[]);
  return { oneOf : keys }
}

const _extract_rows = (inputs)=>{
  const rows = inputs.reduce((acc,input)=>{
    const schema = input.schema.output || {};
    const payload = schema.properties ? schema.properties.payload : {};
    return [...acc, {id:input.id, ...Object.keys(payload).reduce((acc,key)=>{
      acc[key] = payload[key];
      return acc;
    },{})}]
  },[]);
  return { oneOf : rows }
}

const config = {
  category: 'processors',
  color: '#3771C8',
  defaults: {
    name: {
      value: ""
    },
  },

  inputs: 1,
  outputs: 1,

  icon: "fa-list",
  unicode: '\uf03a',

  label: function() {
    return this.name || this.topic || "listify";
  },

  schemafn: (nid, node={}, inputs=[]) => {

    const ptype = extract_ptype_from_inputs(inputs,nid);
    
    const schema = {
      output: {
          type: "object",
          description: "the container object",
          properties: {
            sourceId: {
              type: "string",
              description: "<i>[id]</i>"
            },
            type: {
              type: "string",
              description: "<i>list</i>"
            },
            payload: {
              type: "object",
              description: "values to be rendered as a list",
              properties: {
                timestamp: {
                  type: "number",
                  description: "a unix timestamp"
                },
                keys: _extract_keys(inputs), 
                rows: _extract_rows(inputs),
              },
              
              required: ["timestamp", "keys", "rows"]
            }
          },
          ptype: ptype,
          required: ["sourceId", "type", "payload"]
      },
      input: {
        type: "object",
        description: "the container object",
        properties: {
          payload: {
            type: "object",
            description: "the payload object",
            properties: {
              id: {
                type: "string",
                description: "a unique id"
              },
              values: {
                type: "object",
                description: "the container object",
                properties: {
                  key: {
                    type: "any",
                    description: "a key:value object where value is a primitive type (string,number)"
                  }
                },
              },
              required: ["id", "values"]
            }
          }
        },
        ptype: ptype,
        required: ["payload"]
      }
    };

   

    return schema;
  },

  risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk in formatting data into a list"
      }        
  },

  descriptionfn: () => "<h3>listify</h3>This node will typically connect to the <strong>app</strong> output node.  It takes data from the <strong>payload</strong> of a message and displays it as a table, with the headings the attribute names",

  labelStyle: function() {
    return this.name ? "node_label_italic" : "";
  }
}


export default {
  type: "listify",
  def: Object.assign({_: (id) => {return id}}, config, {nodetype: "listify"}),
  node: Node,
}