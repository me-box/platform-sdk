import React from 'react';
import composeNode from '../../utils/composeNode';
import Textfield from '../../components/form/Textfield';
import Spinner from  '../../components/form/Spinner';
import Select from '../../components/form/Select';
import Payload from '../../components/form/Payload';
import { connect } from 'react-redux';
import {reducer} from './reducer';
import { bindActionCreators } from 'redux';
import { bindNodeIds } from '../../utils/utils';
import * as Actions from './actions';
import {REPEAT_OPTIONS, INTERVAL_OPTIONS, TIMEUNIT_OPTIONS, REPEAT_DEFAULT_OBJECTS} from './constants';

import './style.css';


class Node extends React.Component {

       constructor(props){
            super(props);
            const id = props.selected.id;
            Object.assign(  this, 
              ...bindActionCreators(bindNodeIds(Actions, id), props.dispatch), 
            ); 
            //props.initNodeValue() 
       }

       render() {
          //local is all of the stuff in its reducer
          const {local} = this.props;
          const {repeatOption, payloadMenu, boolMenu, selectedPayload, selectedBool} = local;
          
          const nameprops = {
              name: "name",
              values: this.props.values,
              icon: this.props.icon,
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
              selected: this.props.selected,
          }
          
          const payloadprops = {
              payloadMenu: payloadMenu,
              boolMenu: boolMenu,
              togglePayloadMenu: this.togglePayloadMenu,
              toggleBoolMenu: this.toggleBoolMenu,
              selectPayload: this.selectPayload,
              selectedPayload: selectedPayload,
              selectBool: this.selectBool,
              selectedBool: selectedBool,
          }

          const repeatprops = {
            options: REPEAT_OPTIONS,

            onSelect: (event)=>{
              this.intervalChanged(event.target.value);
              this.props.updateNode('repeat', REPEAT_DEFAULT_OBJECTS[event.target.value] || {});
            },
            
            style: {width:'73%'},
          }
       
          const intervalprops = {
            options: INTERVAL_OPTIONS,
            onSelect: this.unitsChanged,
            style: {width: 100},
          }

          const timeintervalunitprops = {
            options: TIMEUNIT_OPTIONS,
            onSelect: this.timeIntervalUnitsChanged,
            style: {width:90}
          }

          let options = null;

          switch (repeatOption){

            case "none":
              
              options = <div className="form-row" id="node-once">
                          <label>&nbsp;</label>
                          <input type="checkbox" id="node-input-once" style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                          <label style={{width: '70%'}}>inject once at start?</label>
                        </div>
              break;

            case "interval":
              
              options = <div>
                          <div className="form-row inject-time-row" style={{display:'block'}}>
                            <span data-i18n="inject.every">every</span>
                            <Spinner />
                            <Select  {...intervalprops}/>
                            <br/>
                          </div> 
                          <div className="form-row" id="node-once">
                            <label>&nbsp;</label>
                            <input type="checkbox" id="node-input-once" style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                            <label style={{width: '70%'}}>inject once at start?</label>
                          </div>
                        </div>
                break;

            case "interval-time":

               options =  <div className="form-row inject-time-row">
                    <span data-i18n="inject.every"></span>
                    <Select {...timeintervalunitprops} />
                    <span data-i18n="inject.minutes">minutes</span>
                    <br/>
                    <span data-i18n="inject.between">between</span> 
                    <select id="inject-time-interval-time-start" className="inject-time-times"></select>
                    <span data-i18n="inject.and">and</span>
                    <select id="inject-time-interval-time-end" className="inject-time-times"></select><br/>
                    <div id="inject-time-interval-time-days" className="inject-time-days">
                      <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: '5px'}} data-i18n="inject.on">on</div>
                      <div style={{display:'inline-block'}}>
                          <div>
                              <label><input type='checkbox' value='1' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/><span data-i18n="inject.days.0">Monday</span></label>
                              <label><input type='checkbox' value='2' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/><span data-i18n="inject.days.1">Tuesday</span></label>
                              <label><input type='checkbox' value='3' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/><span data-i18n="inject.days.2">Wednesday</span></label>
                          </div>
                          <div>
                              <label><input type='checkbox' value='4' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/> <span data-i18n="inject.days.3">Thursday</span></label>
                              <label><input type='checkbox' value='5' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/> <span data-i18n="inject.days.4">Friday</span></label>
                              <label><input type='checkbox' value='6' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/> <span data-i18n="inject.days.5">Saturday</span></label>
                          </div>
                          <div>
                              <label><input type='checkbox' value='0' onClick={this._handleSelectDay.bind(this, 'repeat', 'on')}/> <span data-i18n="inject.days.6">Sunday</span></label>
                          </div>
                      </div>
                    </div>
                </div>
                break;

            case "time":
                options = <div className="form-row inject-time-row" id="inject-time-row-time">
                          <span data-i18n="inject.at"></span>at<input id="inject-time-time" value="12:00"/><br/>
                          <div id="inject-time-time-days" className="inject-time-days">
                              <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: 5}}>on </div>
                              <div style={{display:'inline-block'}}>
                                  <div>
                                      <label><input type='checkbox' checked value='1'/> <span data-i18n="inject.days.0">Monday</span></label>
                                      <label><input type='checkbox' checked value='2'/> <span data-i18n="inject.days.1">Tuesday</span></label>
                                      <label><input type='checkbox' checked value='3'/> <span data-i18n="inject.days.2">Wednesday</span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='4'/> <span data-i18n="inject.days.3">Thursday</span></label>
                                      <label><input type='checkbox' checked value='5'/> <span data-i18n="inject.days.4">Friday</span></label>
                                      <label><input type='checkbox' checked value='6'/> <span data-i18n="inject.days.5">Saturday</span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='0'/> <span data-i18n="inject.days.6">Sunday</span></label>
                                  </div>
                              </div>
                          </div>
                      </div>
                  break;

              default:
                 options = null;

          }


          return  <div>
                      <div className="form-row">
                          <label>
                              <i className="fa fa-envelope"></i> <span data-i18n="node-red:common.label.payload">Payload</span>
                          </label>
                          <Payload {...payloadprops}/>
                      </div>
                  
                      <div className="form-row">
                          <label><i className="fa fa-tasks"></i> <span data-i18n="common.label.topic">topic</span></label>
                          <input type="text" id="node-input-topic" style={{width: '70%'}}/>
                      </div>

                      <div className="form-row">
                          <label><i className="fa fa-repeat"></i> <span data-i18n="inject.label.repeat">repeat</span></label>
                          <Select {...repeatprops}/>
                          <input type="hidden" id="node-input-repeat"/>
                          <input type="hidden" id="node-input-crontab"/>
                      </div>

                      {options}

                     
                      <div className="form-row">
                        <Textfield {...nameprops}/>
                      </div>

                      <div className="form-tips" data-i18n="[html]inject.tip">
                          <strong>Note:</strong> "interval between times" and "at a specific time" will use cron. See info box for details.
                      </div>
                  </div>
       }

       _handleSelectDay(property, key, event){
          this.props.updateNodeValueKey(property, key, event.target.value)
       }
}

export default composeNode(Node, 'inject',{

        category: 'input',

        color:"#a6bbcf",

        defaults: {
            name: {value:""},
            topic: {value:""},
            payload: {value:"", validate:function(v) {
                return true
            }},
            payloadType: {value:"date"},
            repeat: {value:""},
            crontab: {value:""},
            once: {value:false}
        },

        inputs:0,

        outputs:1,

        icon: "inject.png",

        label: function() {

            if (this.name) {
                return this.name;
            } 
            else if (["string","str","num","bool","json"].indexOf(this.payloadType) != -1){
                if ((this.topic !== "") && ((this.topic.length + this.payload.length) <= 32)) {
                    return this.topic + ":" + this.payload;
                } else if (this.payload.length > 0 && this.payload.length < 24) {
                    return this.payload;
                } else {
                    return this._("inject.inject");
                }
            } else if (this.payloadType === 'date') {
                return this._("inject.timestamp")
            } else if (this.payloadType === 'flow' && this.payload.length < 19) {
                return 'flow.'+this.payload;
            } else if (this.payloadType === 'global' && this.payload.length < 17) {
                return 'global.'+this.payload;
            } else {
                return this._("inject.inject");
            }
        },

        labelStyle: function() {
            return this.name?"node_label_italic":"";
        },

        button: {
            onclick: function() {
               
            }
        },
   }, reducer
);