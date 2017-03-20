import Node from "./node";

const config =  {

    category: 'processors',    
    color: '#002255',
    
    defaults: {             
        name: {value:""},
		name: {value:""},
		field: {value:"payload"},
		fieldType: {value:"msg"},
		format: {value:"handlebars"},
		syntax: {value:"mustache"},
		template: {value:"This is the payload: {{payload}} !"},
    },
    
    inputs:1,               
    outputs:1,             
   
    
    icon: "fa-file-code-o",    
    unicode: '\uf1c9',    
    label: function() {     
        return this.name||"webify";
    },
    
    schemafn: ()=>{
    	return{
    		output:{
    			msg: {
    				type: "object",
    				description: "the container object",
    				properties:{
						name: {type:'string', description: "the name assigned to this webify node"}, 
						sourceId:  {type:'string', description: "<i>[id]</i>"},
						type:{type: 'string', description: "html"},
						
						payload: {
							type: 'object', 
							description: 'the payload object', 
							properties: {
								values: {type:'string',  description: "formatted html"},    					
							},
							required: ["values"]
						}
					},
					required: ["sourceId", "type", "payload"]
				}
			},
			input:{
				type: "object",
				description: "the object whose properties you wish to template",
				properties:{
					any: {type: "any", description: "any object"}
				}
			}
		}	
    },
    
    description: ()=> "<p>Sets a property based on the provided template.</p><p>By default this uses the <i><a href='http://mustache.github.io/mustache.5.html' target='_new'>mustache</a></i></p><p>For example, when a template of:<pre>Hello {{name}}. Today is {{date}}</pre><p>receives a message containing:<pre>{name: \"Fred\",date: \"Monday\" payload...}</pre><p>The resulting property will be:<pre>Hello Fred. Today is Monday</pre><p>By default, mustache will escape any HTML entities in the values it substitutes. To prevent this, use <code>{{{triple}}}</code> braces.",
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    }
}
 

export default {
  type: "webify",
  def: Object.assign({_: (id) => {return id}}, config, {nodetype: "webify"}),
  node: Node,
}