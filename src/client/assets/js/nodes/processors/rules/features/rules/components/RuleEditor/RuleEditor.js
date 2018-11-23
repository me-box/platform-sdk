import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { actionCreators as ruleActions, selector, NAME } from '../..';
import Button from 'react-md/lib/Buttons';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Schema from '../Schema';

import "./style.css";


const STRING_OPERATORS = [
  {label: "is equal to", value: "equal"},
  {label: "contains", value: "contains"},
  {label: "starts with", value: "startswith"},
]

const NUMBER_OPERATORS = [
  {label: "is equal to", value: "eq"},
  {label: "is greater than", value: "gt"},
  {label: "is less than", value: "lt"},
  {label: "is greater than or equal to", value: "gte"},
  {label: "is less than or equal to", value: "lte"},
  {label: "is in the range", value: "range"},
]

const TIME_OPERATORS = [
  {label: "is same as", value: "same"},
  {label: "is earlier than", value: "earlier"},
  {label: "is later than", value: "later"},
  {label: "is between", value: "between"},
]

const _operandsForType = {
  "string": STRING_OPERATORS,
  "number": NUMBER_OPERATORS,
  "time": TIME_OPERATORS,
}


const objectfromschema = (schema)=>{

  
  const {type=""} = schema;
  const _type = type.toLowerCase();
  
  if (_type === "object"){
    return Object.keys(schema.properties).reduce((acc, k)=>{
      return {
        ...acc,
        [k]: objectfromschema(schema.properties[k]),
      }
    },{})
  }
  if (schema.enum){
    return schema.enum[0];
  }
  if (_type === "oneof"){
    return objectfromschema(schema.oneOf[0]);
  }
  if (_type === "string"){
    return "a string";
  }

  if (_type === "number"){
    return "a number";
  }
}

@connect(selector, (dispatch) => {

  return{
     actions: {...bindActionCreators(ruleActions, dispatch)}
  }
})

export default class RuleEditor extends Component {

   constructor(props,context){
      super(props,context);
      this.renderInputNames = this.renderInputNames.bind(this);
      this.renderAttributeNames = this.renderAttributeNames.bind(this);
      this.renderOperators =  this.renderOperators.bind(this);
      this.renderOperand = this.renderOperand.bind(this);
      this.renderOutpuType = this.renderOutputType.bind(this);
      this.renderOutput = this.renderOutput.bind(this);
      //change handlers
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleAttributeChange = this.handleAttributeChange.bind(this);
      this.handleOperatorChange = this.handleOperatorChange.bind(this);
      this.handleOperandChange= this.handleOperandChange.bind(this);
      this.handleOutputTypeChange = this.handleOutputTypeChange.bind(this);
      this.handleMessageChange = this.handleMessageChange.bind(this);

      this.currenttype = this.currenttype.bind(this);
      this.outputItems = this.outputItems.bind(this);

      this.updateRule = this.updateRule.bind(this);
      this.createRule = this.createRule.bind(this);
      this.state = {};
   }    


   componentDidMount(){
     const {defaultrules} = this.props;
     this.props.actions.setRules(this.props.id, defaultrules);
   }
  

   currenttype(rule={}){
    const {paths=[]} = this.props;

    const defaultinput = paths.length > 0 ? paths[0].id : "";

    const input = rule.input || defaultinput;
    
    const items =  ((paths.find(p=>p.id===input) || {}).paths || []).map(p=>p.path.join("."))

    
    const attribute = rule.attribute || items[0];
    const item =  ((paths.find(p=>p.id===input) || {}).paths ||[]).find(p=>p.path.join(".")==attribute);
    return (item || {}).type || "";
   }

   updateRule(rule={}, property, value){
    const {paths, updateNode} = this.props;
    const input = rule.input || paths[0].id;

    const inputitems = paths.map(p=>p.id);
    const attritems =  paths.find(p=>p.id===input).paths.map(p=>p.path.join("."))

    const type = this.currenttype(rule);
    const opitems = _operandsForType[type].map(p=>p.value) || [];

    const msgitems = this.outputItems().map(o=>o.value);
    //set the rule with defaults as required!
    const _rule = {
        input: inputitems[0],
        attribute: attritems[0],
        operator:  opitems[0],
        operand: "",
        outputMessage:  msgitems[0],
        ...rule,
        [property]: value, 
        
     }
    this.props.actions.updateRule(this.props.id, _rule, updateNode);
   }

   createRule(){
     this.props.actions.createRule(this.props.id, this.props.updateNode);
   }

   handleInputChange(rule, value){
    this.setState({input:value, attribute:null, operator:null})
    this.updateRule(rule,"input", value);
   }   

   handleAttributeChange(rule,value){
     this.setState({attribute: value, operator: null})
     this.updateRule(rule,"attribute", value);
   }

   handleOperatorChange(rule,value){
    this.setState({operator: value})
    this.updateRule(rule,"operator", value);
   }

   handleOperandChange(rule,value){
    this.setState({operand: value})
    this.updateRule(rule,"operand", value);
   }

   handleOutputTypeChange(rule, value){
    this.setState({outputType: value, outputMessage:null})
    const output = this.props.outputtypes.find(o=>o.id===value);
    if (output && output.schema){
      const defaultobj = objectfromschema(output.schema);
      this.setState({outputMessage:defaultobj});
      this.updateRule({...rule,outputType:value}, "outputMessage",defaultobj);
    }else{
      this.updateRule(rule, "outputType", value);
    }
   }
   
   handleMessageChange(rule,value){
     this.setState({outputMessage:value});
     this.updateRule(rule, "outputMessage",value);
   }

   renderInputNames(rule){
      const {paths=[]} = this.props;
      const items = paths.map(p=>({label:`${p.name}'s`, value: p.id})) || [];
      const defaultitem = items.length> 0 ? items[0].value : "";

      return <SelectField
      id="inputnames"
      value = {rule.input || defaultitem}
      placeholder="input"
      className="md-cell"
      position={SelectField.Positions.ABOVE}
      menuItems={items}
      simplifiedMenu={false}
      onChange={this.handleInputChange.bind(null,rule)}
    />
    }

   renderAttributeNames(rule){
    const {paths=[]} = this.props;
    
    const defaultinput = paths.length > 0 ? paths[0].id : "";
    const input = rule.input || defaultinput;
    const items =  ((paths.find(p=>p.id===input)||{}).paths || []).map(p=>p.path.join("."))
    
    return <SelectField
    id="inputnames"
    value = {rule.attribute || items[0]}
    placeholder="attribute"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={this.handleAttributeChange.bind(null, rule)}
  />
   }

   renderOperators(rule){
     
    const type = this.currenttype(rule);
   
    const items = _operandsForType[type] || [];
    const defaultoperator = items.length > 0 ? items[0].value : "";

    return <SelectField
    id="inputnames"
    value = {rule.operator || defaultoperator}
    placeholder="operator"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={this.handleOperatorChange.bind(null,rule)}
  />
  
   }

   renderOperand(rule){
      const type = this.currenttype(rule);
      const operand = rule.operand || "";

      switch (operand){
        
        case "equal":
        case "contains":
        case "startswith":
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder="a string"
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />


        case "eq":
        case "gt":
        case "lt":
        case "gte":
        case "lte":
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder="a number"
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />

        case "range":
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder="a range from:to"
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />

        case "earlier":
        case "later":
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder="a time hh-mm-ss"
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />
        
        case "between":
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder="a time range hh-mm-ss:hh:mm:ss"
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />

        default: 
        return <TextField
          id="floating-center-title"
          value={operand}
          lineDirection="center"
          placeholder=""
          className="md-cell md-cell--bottom"
          onChange={this.handleOperandChange.bind(null,rule)}
        />
      }

   }

   outputItems(){
    const {outputtypes=[]} = this.props;

    return  [
       {label:"output a string", value:"string"},
       {label:"output a number", value:"number"}, 
     ...outputtypes.map(o=>({
       label: `output a ${o.name} message`, 
       value:o.id
     }))];
   }

   renderOutputType(rule){
   

    const items = this.outputItems();
    
    return <SelectField
    id="outputtypes"
    value = {rule.outputType || items[0].value}
    placeholder="operator"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={(value)=>this.handleOutputTypeChange(rule,value)}
  />
   }

   renderOutput(rule){

      

      const {outputtypes=[]} = this.props;
      const items = this.outputItems();
      const value = rule.outputType || items[0].value;
      const primitives = ["string", "number", "time", "boolean"];

      

      if (primitives.indexOf(value) === -1){
        const output = outputtypes.find(o=>o.id===value);
        const defaultobj = objectfromschema(output.schema);
     
        return <div>
          <Schema schema={output.schema} message={defaultobj} id={output.id} selectedid={this.state.input} rule={rule} onChange={(msg)=>this.handleMessageChange(rule, msg)}/>
        </div>
      }

      return <div className="outputcentered">
          <div className="primitiveinput">
          <TextField
            id="floating-center-title"
            lineDirection="center"
            placeholder={`your output ${value}`}
            className="md-cell md-cell--bottom"
            onChange={(msg)=>this.handleMessageChange(rule, msg)}
          />
        </div>
        </div>
      
   }

   renderRule(rule){
     const {id}=this.props;
     const style ={
        background: rule.ruleId % 2 === 0 ? "#f2f2f2": "white",
        marginBottom: 10,
        borderTop: "1px solid #b6b6b6",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",

     }

    return <div style={style} key={rule.ruleId}>
    {this.props.rules.length > 1 && <div onClick={(e)=>this.props.actions.deleteRule(id,rule.ruleId)} className="deleterule">
        -
      </div>}
      <div className="container">
        <div className="rulelabel"> when </div>
        <div> {this.renderInputNames(rule)}</div>
        <div> {this.renderAttributeNames(rule)}</div>
        <div> {this.renderOperators(rule)} </div>
        <div> {this.renderOperand(rule)}</div>
        <div className="rulelabel">then</div>
        <div> {this.renderOutputType(rule)}</div>
      </div> 
      <div className="output">
        {this.renderOutput(rule)}
      </div>
      
    </div>
   }

// <Button flat onClick={(e)=>{this.props.actions.serRule("rule")}}>set rule!!</Button>
   render() {
   
  
      const {outputtypes, rules=[]} = this.props;
      
      const items = rules.map((r,i)=>this.renderRule({...r,ruleId:i}));

      return (<div id="ruleeditor">
            {items}
            <div onClick={(e)=>this.createRule()} className="add">
               +
            </div>
          </div>);
    }
}