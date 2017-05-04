import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from "../Schema";
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'nodes/processors/uibuilder/utils';
import TextField from 'react-md/lib/TextFields';
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
    this.state = { sourceId: null, type:"static", selected:null, bufferenter:null, bufferkey:null}; 
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
    

    const schema =   <Schema schema={schemas} onSelect={(key,sourcepath)=>{
        //cannot have closures (so can serialise) so have to insert lookup function (mapping path,key to data value) here;
        const keybody = _wraplookup(key, sourcepath, "return lookup(data)");
        

        this.props.actions.updateTemplateAttribute(nid, path, "enterFn", {
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
 


    const {inputs, nid, path} = this.props;
    const {selected} = this.state;
    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });
   
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
    

    //const srcs = sources.map((source) =>{
    //    return <Box key={source.id} onClick={this._selectSource.bind(null, source.id)}>{source.name}</Box>
    //});

    //const schemas = sources.reduce((acc, source)=>{
    //                                                return (source.id === this.state.sourceId) ? source.schema : acc
    //                                              },{});

    //const schema =   <Schema schema={schemas} onSelect={(key,sourcepath)=>{
    //    const keybody = _wraplookup(key, sourcepath, "return lookup(data)");
    //    this.props.actions.updateTemplateAttribute(path, "enterFn", {
    //                                                                    enter:  {params:["data","index"], body: `return data.person==="mum"`},
    //                                                                    key:    {params:["data", "index"], body: `return "mum"`}                                                              });
    //}}/>
                  
                              
    return <Flex flexColumn={true}>
                  //enter textfield function
                  <TextField
                    id="enterfunction"
                    block
                    rows={4}
                    value={this.state.bufferenter || `return "true"`} 
                    onChange={(e)=>{
                                      this.setState({bufferenter:e})
                                  }
                              }
                  />
                  <TextField
                    id="enterfunction"
                    block
                    rows={4}
                    value={this.state.bufferkey || `return "root"`} 
                    onChange={(e)=>{
                                      this.setState({bufferkey:e})
                                  }
                              }
                  />

                  <Button flat label="submit" onClick={()=>{
                      this.props.actions.updateTemplateAttribute(nid, path, "enterFn", {
                                                                        enter:  {params:["data","index"], body: this.state.bufferenter || `return "true"`},
                                                                        key:    {params:["data", "index"], body: this.state.bufferkey || `return "root"`},
                      }); 
                  }}>submit</Button>
                  //key textfield function
                  //ok button
            </Flex>
 }

 render() {
    const {type} = this.state;

    return (
      <div>
        <ul>
          <li onClick={this._selectType.bind(null, "static")}>
              <strong> static </strong>
          </li>
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