import Node from "./node";

const config = {
    category: 'outputs',    
    color: '#d45500',
    defaults: {             
        name: {value:""},   
        subtype: {value:"set-bulb-on"},
        value: {value:""},
    },

    schemakey: "subtype", 
    
    inputs:1,               
    
    outputs:0,             
   
    icon: "fa-lightbulb-o",
    
    unicode: '\uf0eb',     
    
    label: function() {     
        return this.name||this.topic||"bulbs-out";
    },
    
    schemafn: (subtype)=>{
    
    	const type = subtype || "bulb-on";
    
    	const _descriptions = [		
    							{
                                    key: "type",
                                    value: "set-bulb-on",
    								type: "string", 
    								description: "<i>on</i> or <i>off</i>",
								},
								{
                                    key: "type",
                                    value: "set-bulb-hue",
    								type: "number", 
    								description: "a hue value (0-360)",
								},
								{
                                    key: "type",
                                    value: "set-bulb-brightness",
    								type: "number", 
    								description: "a brightness value (0-255)",
								},
												
		];
    									
    
    	return {
			input:{
				type: "object",
				description: "the container object",
				properties:{
					type: 	{type:'string', description: "one of either \'set-bulb-on\', \'set-bulb-hue\', \'set-bulb-brightness\'", enum: ["set-bulb-on", "set-bulb-hue", "set-bulb-brightness"]},
    				payload: {type: 'oneof', description: `'type' dependent`, oneOf:_descriptions.map((item)=>{
    					return item;
    				})}
    			},
    			required: ["type", "payload"]
    		}
		}
    },
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },
    
    descriptionfn: ()=>"<p> This node allows you to actuate phillips hue bulbs i.e. turn them on or off, change their hue or change brightness </p>",
}

export default {
    type:     "bulbsout",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"bulbsout"}),
    node:     Node,
}
  