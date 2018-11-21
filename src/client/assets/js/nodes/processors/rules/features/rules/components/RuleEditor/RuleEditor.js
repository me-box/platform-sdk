import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as ruleActions, selector, NAME } from '../..';
import Button from 'react-md/lib/Buttons';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import "./style.css";


const STRING_OPERATORS = [
  {label: "is equal to", value: "equal"},
  {label: "contains", value: "contains"},
  {label: "starts with", value: "startswith"},
]

const NUMBER_OPERATORS = [
  {label: "is equal to", value: "equal"},
  {label: "is greater than", value: "gt"},
  {label: "is less than", value: "lt"},
  {label: "is greater than or equal to", value: "gte"},
  {label: "is less than or equal to", value: "lte"},
  {label: "is in the range", value: "range"},
]

const TIME_OPERATORS = [
  {label: "is earlier than", value: "earlier"},
  {label: "is later than", value: "later"},
  {label: "is between", value: "between"},
]

const _operandsForType = {
  "string": STRING_OPERATORS,
  "number": NUMBER_OPERATORS,
  "time": TIME_OPERATORS,
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
      this.handleOutputTypeChange = this.handleOutputTypeChange.bind(this);
     

      this.currenttype = this.currenttype.bind(this);
      this.outputItems = this.outputItems.bind(this);
      this.state = {};
   }    

   currenttype(){
    const {paths} = this.props;
    const input = this.state.input || paths[0].id;
    const items =  paths.find(p=>p.id===input).paths.map(p=>p.path.join("."))
    const attribute = this.state.attribute || items[0];
    const item =  paths.find(p=>p.id===input).paths.find(p=>p.path.join(".")==attribute);
    return item.type;
   }

   handleInputChange(value){
    this.setState({input:value, attribute:null, operator:null})
   }   

   handleAttributeChange(value){
     this.setState({attribute: value, operator: null})
   }

   handleOperatorChange(value){
    this.setState({operator: value})
   }

   handleOutputTypeChange(value){
    this.setState({outputType: value})
   }
   
   renderInputNames(){
      const {paths} = this.props;
      const items = paths.map(p=>({label:`${p.name}'s`, value: p.id}));
      return <SelectField
      id="inputnames"
      value = {this.state.input || items[0].value}
      placeholder="input"
      className="md-cell"
      position={SelectField.Positions.ABOVE}
      menuItems={items}
      simplifiedMenu={false}
      onChange={this.handleInputChange}
    />
    }

   renderAttributeNames(){
    const {paths} = this.props;
    
    const input = this.state.input || paths[0].id;
    const items =  paths.find(p=>p.id===input).paths.map(p=>p.path.join("."))
    
    return <SelectField
    id="inputnames"
    value = {this.state.attribute || items[0]}
    placeholder="attribute"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={this.handleAttributeChange}
  />
   }

   renderOperators(){
    const type = this.currenttype();
   
    const items = _operandsForType[type] || [];
   
    return <SelectField
    id="inputnames"
    value = {this.state.operator || items[0].value}
    placeholder="operator"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={this.handleOperatorChange}
  />
  
   }

   renderOperand(){
      const type = this.currenttype();
      const items = _operandsForType[type] || [];
      const operand = this.state.operator || items[0].value;

      switch (operand){
        
        case "equal":
        case "contains":
        case "startswith":
        return <TextField
          id="floating-center-title"
          lineDirection="center"
          placeholder="a string"
          className="md-cell md-cell--bottom"
        />

        default: 

        return <TextField
          id="floating-center-title"
          lineDirection="center"
          placeholder="something else"
          className="md-cell md-cell--bottom"
        />
      }

   }

   outputItems(){
    const {outputtypes=[]} = this.props;

    return  [
       {label:"output a string", value:"string"},
       {label:"output a number", value:"number"}, 
     ...outputtypes.map(o=>({
       label: `output a ${o.name} object`, 
       value:o.id
     }))];
   }

   renderOutputType(){
     const items = this.outputItems();

    return <SelectField
    id="outputtypes"
    value = {this.state.outputType || items[0].value}
    placeholder="operator"
    className="md-cell"
    position={SelectField.Positions.ABOVE}
    menuItems={items}
    simplifiedMenu={false}
    onChange={this.handleOutputTypeChange}
  />
   }

   renderOutput(){
      const items = this.outputItems();
      const value = this.state.outputType || items[0].value;

      return <div>
        {value}
      </div>
   }
   
// <Button flat onClick={(e)=>{this.props.actions.serRule("rule")}}>set rule!!</Button>
   render() {
      const {outputtypes} = this.props;

      console.log("have outpiut types", outputtypes);

      return (<div id="ruleeditor">
            <div className="container">
                <div> when </div>
                <div> {this.renderInputNames()}</div>
                <div> {this.renderAttributeNames()}</div>
                <div> {this.renderOperators()} </div>
                <div> {this.renderOperand()}</div>
                <div> {this.renderOutputType()}</div>
            </div> 
            <div className="output">
              {this.renderOutput()}
            </div>
          </div>);
    }
}