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
    								type: "set-bulb-on", 
    								description: "set the bulb on",
    								properties: {
    									payload: {
											type: "string",
											description: "<i>on</i> or <i>off</i>",
										}
									}
								},
								{
    								type: "set-bulb-hue", 
    								description: "set the bulb hue",
    								properties: {
    									payload: {
											type: "number",
											description: "a hue value (0-360)",
										}
									}
								},
								{
    								type: "set-bulb-bri", 
    								description: "set the bulb brightness",
    								properties: {
    									payload: {
											type: "number",
											description: "a brightness value (0-255)",
										}
									}
								},
												
		];
    									
    
    	return {
			input:{
				type: "object",
				description: "the container object",
				properties:{
					type: 	{type:'string', description: "one of either \'set-bulb-on\', \'set-bulb-hue\', \'set-bulb-brightness\'", enum: ["set-bulb-on", "set-bulb-hue", "set-bulb-brightness"]},
    				payload: {type: 'object', description: `'type' dependent`, oneOf:_descriptions.map((item)=>{
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
  