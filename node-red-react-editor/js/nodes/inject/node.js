import React from 'react';
import moment from 'moment';
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
import {REPEAT_OPTIONS, INTERVAL_OPTIONS,TIMEINTERVAL_OPTIONS, TIMEUNIT_OPTIONS, REPEAT_DEFAULT_OBJECTS} from './constants';

import './style.css';


class Node extends React.Component {

       constructor(props){
            super(props);
            const id = props.selected.id;
            Object.assign(  this, 
              ...bindActionCreators(bindNodeIds(Actions, id), props.dispatch), 
            );
       }


       render() {
          //local is all of the stuff in its reducer
          const {local} = this.props;
          const {repeatOption, payloadMenu, boolMenu, payloadType, payload, selectedBool} = local;
          

          const nameprops = {
              name: "name",
              value: this.props.values['name'] || this.props.selected['name'] || "",
              icon: "fa fa-tag",
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
              selected: this.props.selected,
          }

          const topicprops = {
              name: "topic",
              values: this.props.values['topic'] || this.props.selected['topic'] || "",
              icon: "fa fa-tasks",
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
              selectPayloadType: this.selectPayloadType,
              payloadType: payloadType,
              payload: payload,
              onChange: this.updatePayload,
              selectBool: this.selectBool,
              selectedBool: selectedBool,
          }

          const repeatprops = {
            options: REPEAT_OPTIONS,

            onSelect: (event)=>{
              this.repeatOptionChanged(event.target.value);
              //this.props.updateNode('repeat', REPEAT_DEFAULT_OBJECTS[event.target.value] || {});
            },
            
            style: {width:'73%'},
          }
       
          /******** props for 'interval' components ************/
          console.log("local is!!!");
          console.log(local);

          const unitprops = {
            options: INTERVAL_OPTIONS,
            onSelect: this.updateRepeatUnits.bind(this),
            style: {width: 100},
            value: local.units ? local.units : 's',
          }

          const intervalspinnerprops = {
            onIncrement: this.incrementRepeat.bind(this,{amount:1}),
            onDecrement: this.incrementRepeat.bind(this,{amount:-1, min: -5}),
            value: local.repeat ? local.repeat || 1 : 1, 
            classes : ['inject-time-count'],
          }

          /******** props for 'time-interval' components ************/

          const timeintervalfrequencyprops = {
            options: TIMEUNIT_OPTIONS,
            onSelect: this.updateTimeIntervalFrequency.bind(this),
            style: {width:90}
          }

          const timeintervalstartprops = {
            options: TIMEINTERVAL_OPTIONS,
            onSelect: this.updateTimeIntervalStart.bind(this),
            style: {width:90},
            value: this.props.values.repeat ? this.props.values.repeat.start : '0',
          }

          const timeintervalendprops = {
            options: TIMEINTERVAL_OPTIONS,
            onSelect: this.updateTimeIntervalEnd.bind(this),
            style: {width:90},
            value: this.props.values.repeat ? this.props.values.repeat.end : '0',
          }

          /******** props for 'time' components ************/
          const timespinnerprops = {
            //these inceremant. decrement should be handled in the local actions!! then pased on to the main later!
            onIncrement: this.incrementSpecificTime.bind(this,1),//generalise this
            onDecrement: this.incrementSpecificTime.bind(this,-1),
            value: local.specificTime ? local.specificTime : "12.00",
            classes : [],
            style: {width: 75},
          }

          let options = null;

          switch (repeatOption){

            case "none":
              
              options = <div className="form-row" id="node-once">
                          <label>&nbsp;</label>
                          <input type="checkbox" onChange={this.updateOnce.bind(this)} style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                          <label style={{width: '70%'}}>inject once at start?</label>
                        </div>
              break;

            case "interval":
              
              options = <div>
                          <div className="form-row inject-time-row" style={{display:'block'}}>
                            <span data-i18n="inject.every">every</span>
                            <Spinner {...intervalspinnerprops} />
                            <Select  {...unitprops}/>
                            <br/>
                          </div> 
                          <div className="form-row" id="node-once">
                            <label>&nbsp;</label>
                            <input type="checkbox" onChange={this.updateOnce.bind(this)} id="node-input-once" style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                            <label style={{width: '70%'}}>inject once at start?</label>
                          </div>
                        </div>
                break;

            case "interval-time":

               options =  <div className="form-row inject-time-row">
                    <span data-i18n="inject.every"></span>
                    <Select {...timeintervalfrequencyprops} />
                    <span data-i18n="inject.minutes">minutes</span>
                    <br/>
                    <span data-i18n="inject.between">between</span> 
                    <Select {...timeintervalstartprops} />
                    <span data-i18n="inject.and">and</span>
                    <Select {...timeintervalendprops} />
                    <br/>
                    <div id="inject-time-interval-time-days" className="inject-time-days">
                      <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: '5px'}} data-i18n="inject.on">on</div>
                      <div style={{display:'inline-block'}}>
                          <div>
                              <label><input type='checkbox' value='1' onClick={this.updateTimeIntervalOn.bind(this)}/><span data-i18n="inject.days.0">Monday</span></label>
                              <label><input type='checkbox' value='2' onClick={this.updateTimeIntervalOn.bind(this)}/><span data-i18n="inject.days.1">Tuesday</span></label>
                              <label><input type='checkbox' value='3' onClick={this.updateTimeIntervalOn.bind(this)}/><span data-i18n="inject.days.2">Wednesday</span></label>
                          </div>
                          <div>
                              <label><input type='checkbox' value='4' onClick={this.updateTimeIntervalOn.bind(this)}/> <span data-i18n="inject.days.3">Thursday</span></label>
                              <label><input type='checkbox' value='5' onClick={this.updateTimeIntervalOn.bind(this)}/> <span data-i18n="inject.days.4">Friday</span></label>
                              <label><input type='checkbox' value='6' onClick={this.updateTimeIntervalOn.bind(this)}/> <span data-i18n="inject.days.5">Saturday</span></label>
                          </div>
                          <div>
                              <label><input type='checkbox' value='0' onClick={this.updateTimeIntervalOn.bind(this)}/> <span data-i18n="inject.days.6">Sunday</span></label>
                          </div>
                      </div>
                    </div>
                </div>
                break;

            case "time":
                options = <div className="form-row inject-time-row" id="inject-time-row-time">
                          <span>at</span>
                          <Spinner {...timespinnerprops} />
                          <br/>
                          <div id="inject-time-time-days" className="inject-time-days">
                              <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: 5}}>on </div>
                              <div style={{display:'inline-block'}}>
                                  <div>
                                      <label><input type='checkbox' value='1' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.0">Monday</span></label>
                                      <label><input type='checkbox' value='2' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.1">Tuesday</span></label>
                                      <label><input type='checkbox' value='3' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.2">Wednesday</span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' value='4' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.3">Thursday</span></label>
                                      <label><input type='checkbox' value='5' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.4">Friday</span></label>
                                      <label><input type='checkbox' value='6' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.5">Saturday</span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' value='0' onClick={this.updateSpecificTimeOn.bind(this)}/> <span data-i18n="inject.days.6">Sunday</span></label>
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
                          <Textfield {...topicprops}/>
                      </div>

                      <div className="form-row">
                          <label><i className="fa fa-repeat"></i> <span data-i18n="inject.label.repeat">repeat</span></label>
                          <Select {...repeatprops}/>
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

       _incrementInterval(options, event){
          this.props.incrementNodeValueKey(options.property, options.key, options.amount, options.min, options.max);
       }

       _decrementInterval(){
          this.props.incrementNodeValueKey('repeat', 'frequency', -1, 1);
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