import Node from './node';

const config = {

	category: 'outputs',      
	color: '#d45500',
	
	defaults: {
    	name: {value:""},
        active: {value:true},
        console: {value:"false"},
        complete: {value:"false", required:true}
    },
	
	inputs:1,               
	outputs:0,             
	
	schemafn: ()=>{					
		return	{
			input:{
				type: "object",
				description: "any object",
				properties:{
					any: {type:"any", description: "any object"}
				}
			}	
		}
	},
	
	risk: (subtype="loadavg1")=>{
      return {
        score: 0,
        reason: "a debug node only runs in the test environment"
      }
  	},

	icon: "fa-bug",
	unicode: '\uf188 ',     
	label: function() {     
		return this.name||"debugger";
	},
	labelStyle: function() { 
		return this.name?"node_label_italic":"";
	},
	descriptionfn: ()=>"<p>The Debug node can be connected to the output of any node. It can be used to display the output of any message property in the debug tab of the sidebar. The default is to display <code>msg.payload</code>.</p> <p>Each message will also display the timestamp, and the type of property chosen to output.</p><p>If the payload is an object or buffer it will be stringified first for display and indicate that by saying '(Object)' or '(Buffer)'.</p>",

};

export default {
    type:     "debugger",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"debugger"}),
    node:     Node,
}