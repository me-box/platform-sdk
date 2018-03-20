import Node from "./node";

const config =  {

        category: 'datastores',      
        color: '#ffcc00',
        
        defaults: {             
            name: {value:""},   
            subtype: {value:"twitterHashTagStream"},
        },
        schemakey: "subtype",
        inputs:0,               
        outputs:1,             
        
        schemafn: (subtype)=>{
        
			const type = subtype || "twitterHashTagStream";
			
			const _descriptions = {
				twitterHashTagStream: "a twitter hash tag stream",
				twitterUserTimeLine: "a twitter user timeline",
			}
			        			
			return	{
        		output:{
    				type: "object",
    				description: "the container object",
    				properties:{
						name: {type:'string', description: "a name assigned to this twitter node"}, 
						id:  {type:'string', description: "<i>[id]</i>"},
						type:{type: 'string', description: "<i>twitter</i>"},
						//subtype: {type: 'string', description: `<i>${type}</i>`},
				
						payload: {
							type: 'object', 
							description: 'the payload object', 
							properties: {
								ts: {type:'time', description: 'a unix timestamp'},
								value: {type:'string',  description: "a tweet"},    					
							},
							required: ["ts", "value"]
						}
					},
					required: ["id", "type", "subtype", "payload"],
                    
                    ptype : [
                        {
                            type: "identifier",
                            ordinal: "primary",
                            description: "a tweet or twitter username can be matched to an individual",
                            required: ["payload.value"],
                            accretion: false,
                        },
                    ]
        		}
        	}
        },

        risk: (subtype="twitterHashTagStream")=>{  
          return {
            score: 2,
            reason: "this datastore will have access to your public and protected tweets "
          }
        },
        
        icon: "fa-twitter",
        unicode: '\uf099',     
        label: function() {     
            return this.name||"twitter";
        },
        labelStyle: function() { 
            return this.name?"node_label_italic":"";
        },
        descriptionfn: ()=>"<h3> twitter node </h3> This node will provide the latest tweets from a twitter account.  The twitter account is configured at runtime, and allows a user to subscribe to a list of twitter hashtags",

}
                          
export default {
    type:     "twitter",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"twitter"}),
    node:     Node,
}