import Node from "./node";
import {ptypes} from "./ptypes";

const ptype = (nid,node={})=>{
    const profiles = node.profiles;

    const ptype = Object.keys(ptypes).reduce((acc, key)=>{
        if (profiles.indexOf(key)!==-1){
            return [...acc, ...ptypes[key].map((item)=>{
                return {...item, required:[`payload.${key}`]}
            })]                    
        }
        return acc;
    },[]);

    return {[nid]:ptype}
}

const schema = (profiles=[])=>{
    return {
        "payload" : {type: "object", properties: profiles.reduce((acc,p)=>{
            return {
                ...acc,
                [p] : {type:"string", description:`${p}`}
            }
        },{})}
    }
}

const config = {
    
    category: 'datastores',      
    
    color: '#ffcc00',
    
    defaults: {             
        name: {value:""},   
        profiles: {value:[]},
    },
    
    inputs:0,               
    
    outputs:1,             
   
    icon: "fa-user-secret",
    
    unicode: '\uf21b',     
    
    label: function() {     
        return this.name||this.topic||"sensitive";
    },
    
    schemafn: (nid,node={},inputs=[])=>{
       

        const type = node.subtype || "sensitive";
        console.log("calculated schema is", schema(node.profiles));
        return {
            output:{
                type: "object",
                description: "the container object",
                properties: schema(node.profiles),
                ptype: ptype(nid, node)
            }
        }
    },

    descriptionfn:(subtype)=>{
        switch(subtype){
            default:
                return "all user created entries relating to sensitive personal profile";
        }
    } 
}

export default {
    type:     "sensitive",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"sensitive"}),
    node:     Node,
}