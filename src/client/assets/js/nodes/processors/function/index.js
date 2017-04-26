import Node from "./node";

const config = {
    category: 'processors',    
    color: '#002255',
    
    defaults: {             
        name: {value:""},
		func: {value:"return msg;"},
		outputs: {value:1},
        inputtypedef: {value:""},
        outputtypedef: {value:""},
		noerr: {value:0,required:true,validate:function(v){ return ((!v) || (v === 0)) ? true : false; }}
    },
    
    inputs:1,               
    outputs:1,             
   
    icon: "fa-code",    
    unicode: '\uf121',    
    label: function() {     
        return this.name||this.topic||"dbfunction";
    },
    
    descriptionfn: ()=> "<p>A function block where you can write code to do more interesting things.</p> <p>The message is passed in as a JavaScript object called <code>msg</code>.</p> <p>By convention it will have a <code>msg.payload</code> property containing the body of the message.</p><h4>Sending messages</h4><p>The function can either return the messages it wants to pass on to the next nodes in the flow, or can call <code>node.send(messages)</code>.</p><p>It can return/send:</p><ul><li>a single message object - passed to nodes connected to the first output</li><li>an array of message objects - passed to nodes connected to the corresponding outputs</li></ul><p>If any element of the array is itself an array of messages, multiple messages are sent to the corresponding output.</p><p>If null is returned, either by itself or as an element of the array, no message is passed on.</p>",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },

    schemafn:()=>{return {}}
  
}

export default {
    type:     "dbfunction",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"dbfunction"}),
    node:     Node,
}