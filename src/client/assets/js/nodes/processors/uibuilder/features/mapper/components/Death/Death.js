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

export default class Death extends PureComponent {
  
 constructor(props) {
    super(props);
    this.state = { sourceId: null, selected:null, bufferexit:"return false"}; 
    this._selectSource = this._selectSource.bind(this);
 }

 renderFunction() {
 
    const {inputs, nid, path} = this.props;
    const {selected, bufferexit="return false"} = this.state;
    
    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });
   
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
   
    const exitFn = {
                      params:["data","index"], 
                      body: bufferexit,
                    }

    console.log("passing in value");
    console.log(bufferexit);

                                                                               
    return <Flex flexColumn={true}>      
              <TextField
                id="exitfunction"
                block
                rows={4}
                value={bufferexit} 
                onChange={(e)=>{this.setState({bufferexit:e})}}
              />
              <Button flat label="submit" onClick={()=>{this.props.actions.updateTemplateAttribute(nid, path, "exitFn", exitFn)}}>submit</Button>
            </Flex>
 }

 render() {
    return this.renderFunction();
 }

  _selectSource(sourceId){
    this.setState({sourceId});
  }

}