import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from "../Schema";
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'nodes/processors/uibuilder/utils';
//import TextField from 'react-md/lib/TextFields';
import Textarea from 'components/form/Textarea';
import Button from 'react-md/lib/Buttons/Button';

const _wraplookup = (key,sourcepath,fnstr)=>{
    const _path = JSON.stringify(sourcepath); 
    return `const lookup=(data)=>${_path}.reduce((acc,item)=>{return acc[item]},data)["${key}"]; ${fnstr}`; 
}

@connect(selector, (dispatch) => {
  return {
      actions: bindActionCreators(templateActions, dispatch)
  }
})

export default class Birth extends PureComponent {
  
  constructor(props) {
    super(props);
    const {enterFn} = props.template;

    this.state = { 
        sourceId: null, 
        type:"static", 
        selected:null, 
    }

    this._selectSource = this._selectSource.bind(this);
    this._selectType = this._selectType.bind(this);
  }

  renderKeys() {
   
    const {inputs, nid, path} = this.props;
    const {selected} = this.state;
    
    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });

 
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
    const datakey = this.props.template.enterFn ? this.props.template.enterFn.datakey : null;


    const schema =   <Schema schema={schemas} selected={datakey} onSelect={(key,sourcepath)=>{
        //cannot have closures (so can serialise) so have to insert lookup function (mapping path,key to data value) here;
        
        const keybody = _wraplookup(key, sourcepath, "return lookup(data)");
        
        this.props.actions.updateTemplateAttribute(nid, path, "enterFn", {
                                                                              datakey: {key,path:sourcepath},
                                                                              enter:  {params:["data","index"], body: "return true"},
                                                                              key:    {params:["data", "index"], body: keybody}
                                                                          });


    }}/>
          
                              
    return <Flex flexColumn={true}>

                  {srcs}
                  {schema}
            </Flex>
 }

 renderFunction() {
 
    const {inputs, nid, path, node, template} = this.props;
    const {selected} = this.state;
    const datakey = template.enterFn ? template.enterFn.datakey : false;

    const fn = template.enterFn ? template.enterFn.enter.body || "return true" : "return true";
    const key  = template.enterFn ? template.enterFn.key.body   || `return "root"` : `return "root"`;

    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });
   
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
                              
    return <Flex flexColumn={true}>
                  
                  <div className="info">
                      The key that will belong to the new item (i.e. every different key will map to a new item)
                  </div>
                  <Textarea
                    id="enterkey"
                    value={ datakey ? `return "root"` : key } 
                    onChange={(id,e)=>{
                                      this.props.actions.updateTemplateAttribute(nid, path, "enterFn", {
                                            key:  {params:["data","index"],  body: e.target.value},
                                            enter:    {params:["data", "index"], body: datakey ? "" : template.enterFn ? template.enterFn.enter.body : `return "root"`},
                                      }); 
                                  }
                              }
                  />

                  <div className="info">
                    The function that will determine whether the key is created or not.  This function will be passed in the mapping data
                  </div>
                  
                  <Textarea
                    id="enterfunction"
                    value={ datakey ? `return true` : fn} 
                    onChange={(id,e)=>{
                                     this.props.actions.updateTemplateAttribute(nid, path, "enterFn", {
                                            key:  {params:["data","index"],  body: datakey ? "" : template.enterFn? template.enterFn.key.body : "return true" },
                                            enter:    {params:["data", "index"], body: e.target.value},
                                      }); 
                              }
                    }
                  />

                  

                 
        
            </Flex>
 }


 render() {
    const {type} = this.state;
    

    return (
      <div>
        <div className="title"> birth options </div>
        <ul>
          <li onClick={this._selectType.bind(null, "key")}>
            <strong> bind to data key </strong>
            {type==="key" && this.renderKeys()}
          </li>
           <li onClick={this._selectType.bind(null, "function")}>
            <strong> bind to data function </strong>
             {type==="function" && this.renderFunction()}
          </li>
        </ul>
      </div>
    );
  }


  _selectType(type){
    this.setState({type});
  }

  _selectSource(sourceId){
    this.setState({sourceId});
  }

}