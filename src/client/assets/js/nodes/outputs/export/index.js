import Node from "./node";

const config = {
    category: 'outputs',    
    color: '#d45500',
    defaults: {             
        name: {value:""},   
        urls: {value:""},
        payload: {value:{}},
    },

    schemakey: "", 
    
    inputs:1,               
    
    outputs:0,             
   
    icon: "fa-cloud",
    
    unicode: '\uf0c2',     
    
    label: function() {     
        return this.name||this.topic||"export";
    },
    
    schemafn: (subtype)=>{	
    
    	return {
			input:{
				type: "object",
				description: "the container object",
				properties:{
                    name:   {type:'string', description: 'the name of this node'},
					urls: 	{type:'string', description: 'a comma separated list of urls you want to call'},
    				payload: {
                        type: 'object',
                        description: 'the data you want to POST',
                        properties:{
                            any: {type: "any", description: "any object"}
                        }   
                    }
                }
            }
		}
    },

    risk: (subtype="")=>{
        return  {
            score: 5,
            reason: "sending data off the box to an external url is high risk"
        }
    },
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },
    
    descriptionfn: ()=>"<p> This node allows you to send your data off the databox to an external url",
}

export default {
    type:     "export",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"export"}),
    node:     Node,
}
  