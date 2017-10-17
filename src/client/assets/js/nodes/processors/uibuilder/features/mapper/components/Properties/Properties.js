import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Flex, Box } from 'reflexbox';
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';

import {typeForProperty, enumForPropery} from 'nodes/processors/uibuilder/utils';

export default class Properties extends Component {
  
  
  constructor(props){
      super(props);
      this.state = { activeTabIndex: 0};
      this._handleTabChange = this._handleTabChange.bind(this);
      this._updateAttribute = this._updateAttribute.bind(this);
      this._updateStyle = this._updateStyle.bind(this);
      this.renderEnum = this.renderEnum.bind(this);
  }

  
  renderAttributes(){

      const { template ={}}       = this.props;
      const ignore = ["id", "style", "type", "children", "enterFn", "exitFn"];
     
      const form = Object.keys(template).filter((key)=>ignore.indexOf(key)==-1).map((key,i)=>{
          const props = { 
            value: template[key] || "",
            id:key,
            onBlur:(property,event)=>{
               this._updateAttribute(property, event.target.value);
            }
          }
          const textfield =  <div className="centered"><Textfield {...props}/></div>
          return <Cell key={key} title={key} content={textfield}/>
      });

      return <Cells>{form}</Cells>
  }

  renderEnum(type, key, value){
    
    const typeprops = {
          options : enumForPropery(type, key).map(i=>{return {name:i, value:i}}),
          onSelect: (event)=>{
            this._updateStyle(key, event.target.value);
          },
          style: {width: '100%'},
          value: value,
    }
  
    return  <Select {...typeprops}/>                       
  
  }

  renderStyle(){
          
      const { template={}, updateStyle } = this.props;
      const {style={}} = template;

      const form = Object.keys(style).map((key,i)=>{

         
          if (typeForProperty(template.type, key) === "enum"){
            return <Cell key={key} title={key} content={this.renderEnum(template.type, key, style[key])}/>
          }
          else{
            const props = { 
              value: style[key],
              id:key,

              onBlur:(property, event)=>{
                this._updateStyle(property, event.target.value);
              }
            }
            const textfield =  <div className="centered"><Textfield {...props}/></div>
            return <Cell key={key} title={key} content={textfield}/>
          }
      });

      return <Cells>{form}</Cells>
  }
                

  render(){ 
      return <div>
                {this.renderAttributes()}
                {this.renderStyle()}
              </div>
             
  }

  _updateStyle(key, value){
    this.props.updateStyle(key,value);
  }

  _updateAttribute(key, value){
    this.props.updateAttribute(key,value);

  }
   _handleTabChange(activeTabIndex) {
      this.setState({ activeTabIndex });
   }
}