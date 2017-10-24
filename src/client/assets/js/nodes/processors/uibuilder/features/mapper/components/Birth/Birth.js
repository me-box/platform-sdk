import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from "../Schema";
import InputSchema from 'features/help/components/Schema';
import { actionCreators as templateActions } from 'nodes/processors/uibuilder/features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'nodes/processors/uibuilder/utils';
import cx from 'classnames';

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

    this.state = { 
        sourceId: null, 
        type:"static", 
        selected:null, 
        showSchema: false,
    }

    this._selectSource = this._selectSource.bind(this);
    this._selectType = this._selectType.bind(this);
    this.renderBirthInputs = this.renderBirthInputs.bind(this);
    this.toggleSchema = this.toggleSchema.bind(this);
  }

  renderKeys() {
     
    const {inputs, nid, path} = this.props;
    const {selected} = this.state;
   
    const srcs = inputs.map((input) => {
        const cname = cx({
            sourceName: true,
            selected: selected === input.id,
        });
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box className={cname} key={input.id} onClick={()=>{
          this.setState({selected: input.id})
        }}>{name}</Box>
    });

    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
    const datakey = this.props.value? this.props.value.datakey : null;

    const schema =   <Schema schema={schemas} selected={datakey} onSelect={(key,sourcepath)=>{
        //cannot have closures (so can serialise) so have to insert lookup function (mapping path,key to data value) here;
        const keybody = _wraplookup(key, sourcepath, "return lookup(data)"); 
        this.props.onChange({
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

 renderBirthInputs(){

    const {inputs, mapping} = this.props;
  
    const source = inputs.reduce((acc,input)=>{
        if (mapping.from.sourceId === input.id)
           return input.schema ? input.schema.output : acc
        return acc;
    },null);

    return <div style={{padding:10}}><InputSchema schema={source}/></div> 
 }
 
 toggleSchema(){
    this.setState({showSchema:!this.state.showSchema});
 }

 renderFunction() {
   
    const {inputs, nid, path, node, value} = this.props;
    const {selected} = this.state;
    const datakey = value ? value.datakey : false;

    const fn = value ? value.enter.body || "return true" : "return true";
    const key  = value ? value.key.body   || `return "root"` : `return "root"`;

    const srcs = inputs.map((input) => {
        const name = input.name.trim() === "" ? input.label : input.name;
        return <Box key={input.id} onClick={()=>{this.setState({selected: input.id})}}>{name}</Box>
    });
   
    const schemas = inputs.reduce((acc, input)=>{return (input.id === selected) ? input.schema.output : acc;},{});
                              
    return <Flex flexColumn={true}>
                  
                  <div className="help">
                    Each of the two functions below will be passed in two parameters: <strong onClick={()=>this.toggleSchema()}>data (click to toggle schema) </strong> and index (an integer that increments with each new item of data)
                    {this.state.showSchema && this.renderBirthInputs()}
                  </div>

                  <div className="help">
                      The key that will belong to the new item (i.e. every different key will map to a new item)
                  </div>
                  <Textarea
                    id="enterkey"
                    value={ datakey ? `return "root"` : key } 
                    onChange= {(id,e)=>{
                                    this.props.onChange({
                                            key:  {params:["data","index"],  body: e.target.value},
                                            enter:    {params:["data", "index"], body: datakey ? "" : value ? value.enter.body : `return "root"`},
                                    }
                                )
                              }
                    }
                  />

                  <div className="help">
                    The function that will determine whether the key above is created or not.  Return true or false
                  </div>
                  
                  <Textarea
                    id="enterfunction"
                    value={ datakey ? `return true` : fn} 
                    onChange={(id,e)=>{
                                     this.props.onChange({
                                            key:  {params:["data","index"],  body: datakey ? "" : value ? value.key.body : "return true" },
                                            enter:    {params:["data", "index"], body: e.target.value},
                                      }); 
                              }
                    }
                  />
            </Flex>
 }  


 renderReset(){
      const style={
        background: "#667793",
      }
      return  <div style={{padding:10}}>
                <p> Would you like to set the birth and death functions to default? </p>
               <button className="button selected" style={style} onClick={()=>{this.props.onChange(null)}}>yes please</button>
              </div>
 }
  
 render() {

    const {type} = this.state;

    return (<div>
              <div className="help">
                This is an advanced option that allows you to clone your objects.  Each object has a unique "key" that identifies it. If the key changes then a new object is automatically cloned.  By default the key remains static, set to "root".  However, if you make the key a variable, then a new object will be created for each instance of the key.  You are given the option to bind the key to an item of data (so every time the data value changes a new object is created), or to bind it to a function, where the function returns true or false whether the a new item should be created, and provides a key name 
              </div>
              <Flex align="center" style={{background:"#5f9ea0", color:"#fff", textAlign:"center"}}>
                    <Box auto p={1} onClick={this._selectType.bind(null, "key")} style={{borderRight:"1px solid", fontWeight: type==="key" ? 'bold' : 'normal'}}> bind to key </Box>
                    <Box auto p={1} onClick={this._selectType.bind(null, "function")}   style={{borderRight:"1px solid", fontWeight: type==="function" ? 'bold' : 'normal'}}> bind to function </Box>   
                    <Box auto p={1} onClick={this._selectType.bind(null, "reset")}   style={{fontWeight: type==="reset" ? 'bold' : 'normal'}}> reset </Box> 
              </Flex>
              {type==="key" && this.renderKeys()}
              {type==="function" && this.renderFunction()}
              {type==="reset" && this.renderReset()}
            </div>);
  }


  _selectType(type){
    this.setState({type});
  }

  _selectSource(sourceId){
    this.setState({sourceId});
  }

}