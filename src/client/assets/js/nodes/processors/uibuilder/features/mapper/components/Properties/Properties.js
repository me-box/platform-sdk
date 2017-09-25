import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Flex, Box } from 'reflexbox';
//import '../../../../../styles/index.scss';

//import Tabs from 'react-md/lib/Tabs/Tabs';
//import Tab from 'react-md/lib/Tabs/Tab';
//import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
//import TextField from 'react-md/lib/TextFields';

import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';

export default class Properties extends Component {
  
  
  constructor(props){
      super(props);
      this.state = { activeTabIndex: 0};
      this._handleTabChange = this._handleTabChange.bind(this);
      this._updateAttribute = this._updateAttribute.bind(this);
      this._updateStyle = this._updateStyle.bind(this);
  }

  
  renderAttributes(){

      const { template ={}}       = this.props;
      const ignore = ["id", "style", "type", "children", "enterFn", "exitFn"];
     
      const form = Object.keys(template).filter((key)=>ignore.indexOf(key)==-1).map((key,i)=>{
          const props = { 
            value: template[key] || "",
            id:key,
            onChange:(property, event)=>{
                this._updateAttribute(property, event.target.value);
            }
          }
          const textfield =  <div className="centered"><Textfield {...props}/></div>
          return <Cell key={key} title={key} content={textfield}/>
      });

      return <Cells>{form}</Cells>
  }


  renderStyle(){
      
      
      const { template={}, updateStyle } = this.props;
      const {style={}} = template;

      const form = Object.keys(style).map((key,i)=>{
          const props = { 
            value: style[key],
            id:key,
            onChange:(property, event)=>{
                this._updateStyle(property, event.target.value);
            }
          }
          const textfield =  <div className="centered"><Textfield {...props}/></div>
          return <Cell key={key} title={key} content={textfield}/>
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