import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from "../Schema";
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'nodes/processors/uibuilder/utils';
import Textarea from 'components/form/Textarea';
import Textfield from 'components/form/Textfield';
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

export default class Death extends PureComponent {
  
 constructor(props) {
    super(props);
    this.state = { sourceId: null, selected:null, timeexit:"", functionexit:"return false"}; 
    this._selectSource = this._selectSource.bind(this);
 }

 renderFunction() {
 
    const {inputs, nid, path, template} = this.props;
    const {selected, timeexit="", functionexit="return false"} = this.state;
    
    console.log("exit fn", template.exitFn);

    const fn = template.exitFn ? template.exitFn.body || "return false" : "return false";

    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });
   
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});

    return <Flex flexColumn={true}>   
              <div className="title"> death options </div>   
                <div className="info">
                    A timeout period after which, if there is no data for this key, the object is deleted
                </div>
                <Textfield
                  id="exittime"
                  value={timeexit} 
                  onChange={(id,e)=>{this.setState({timeexit:e.target.value})}}
                />

                <div className="info">
                    A function evaluated at the next receipt of data, return true to delete, false otherwise 
                </div>
                <Textarea
                  id="exitfunction"
                  value={fn} 
                  onChange={(id,e)=>{
                        console.log("updating exit fn!!");
                        this.props.actions.updateTemplateAttribute(nid, path, "exitFn", {params:["data", "index"], body:e.target.value});
                  }}
                />
             
            </Flex>
 }

// <Button flat label="submit" onClick={()=>{}}>submit</Button>

 render() {
    return this.renderFunction();
 }

  _selectSource(sourceId){
    this.setState({sourceId});
  }

}