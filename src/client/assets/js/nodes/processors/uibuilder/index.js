import Node from "./node";
import reducer from './reducer';

const config = {
    category: 'processors',    
    color: '#002255',
    defaults: {             
        name: {value:""},
        templates: {value:{}},
        mappings: {value:[]},
        transformers: {value:{}},   
        canvasdimensions:{value:null},
        tree: {value:{}}, 
    },

    inputs:1,               
    
    outputs:1,             
   
    icon: "fa-picture-o ",
    
    unicode: '\uf03e',     
    
    label: function() {     
        return this.name||"uibuilder";
    },
    
    schemafn:()=>{return {}},
    
    labelStyle: function() { 
        return this.name?"node_label_italic":"";
    },
    
    descriptionfn: ()=>"<p> This node allows you to create svg animations from input data </p>",

    risk: (subtype="")=>{
      return {
          score: 0,
          reason: "no risk in creating visualistions using uibuilder"
      }        
    },
}

export default {
    type:     "uibuilder",
    def:      Object.assign({_: (id)=>{return id}}, config, {nodetype:"uibuilder"}),
    node:     Node,
    reducer
}
  