import React, {Component} from 'react';
import moment from 'moment';
import composeNode from 'utils/composeNode';
import Textfield from 'components/form/Textfield';
import Spinner from  'components/form/Spinner';
import Select from 'components/form/Select';
import DayGrid from 'components/form/DayGrid';
import Payload from 'components/form/Payload';
import { connect } from 'react-redux';
import {reducer} from './reducer';
import { bindActionCreators } from 'redux';
import { bindNodeIds } from 'utils/utils';
import * as Actions from './actions';
import {REPEAT_OPTIONS, INTERVAL_OPTIONS,TIMEINTERVAL_OPTIONS, TIMEUNIT_OPTIONS, REPEAT_DEFAULT_OBJECTS} from './constants';
import {configNode} from 'utils/ReactDecorators'; 
import './styles/style.css';
import TimePicker from 'react-md/lib/Pickers/TimePickerContainer';

@configNode()              
export default class Node extends Component {

      constructor(props){

            super(props);
            const id = props.node.id;
            
            this._actions = {
                                ...bindActionCreators(bindNodeIds(Actions, id), props.dispatch),
                                _intervalChecked: this._intervalChecked.bind(this),
                                _specificTimeChecked: this._specificTimeChecked.bind(this),
                                _selectPayloadType:this._selectPayloadType.bind(this),
                            }; 
       }
       
      renderNoneOptions(){

        const {local : {once}} = this.props;
        
        return  <div>
                  <div className="flexrow">
                    <div className="title"> 
                      <div className="centered"></div>
                    </div>
                    <div>
                      <div className="flexcolumn">
                        <div className="flexrow">
                          <div>
                            <div className="centered">
                              inject once at start?
                            </div>
                          </div>
                          <div>
                            <div className="centered">
                              <input type="checkbox" checked={once || false} onChange={this._actions.updateOnce.bind(this)} style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>                    
                </div>
      }

      renderIntervalOptions(){
        
        const {local : {units, repeat, once}} = this.props;

        const unitprops = {
          options: INTERVAL_OPTIONS,
          onSelect: this._actions.updateRepeatUnits.bind(this),
          style: {width: 100},
          value: units ? units : 's',
        }

        const intervalprops = {
            id: "repeat",
            value: repeat ? repeat : 1,
            onChange: (property, event)=>{
               this._actions.setRepeat(event);
            },
            style:{width:40},
        }

        return  <div className="flexrow">
                  <div className="title">  
                      <div className="centered">options</div>
                  </div>
                  <div>
                    <div className="flexcolumn">  
                      <div>
                        <div className="flexrow">
                          <div className="title"> 
                            <div className="centered">
                              every
                            </div>
                          </div>
                          <div className="fixed" style={{width:50}}>
                            <Textfield {...intervalprops}/>
                          </div>
                          <div>
                            <Select  {...unitprops}/>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flexrow">
                          <div>
                            <div className="centered">
                              inject once at start?
                            </div>
                          </div>
                          <div>
                            <div className="centered">
                              <input type="checkbox" checked={once || false} onChange={this._actions.updateOnce.bind(this)} style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>                             
                </div>

      }

      renderIntervalTimeOptions(){
        
        const {local : {intervalStart, intervalEnd, intervalOn, intervalFrequency}} = this.props;

        const timeintervalfrequencyprops = {
            options: TIMEUNIT_OPTIONS,
            onSelect: this._actions.updateTimeIntervalFrequency.bind(this),
            style: {width:90},
            value: intervalFrequency || 1,
        }

        const timeintervalstartprops = {
          options: TIMEINTERVAL_OPTIONS,
          onSelect: this._actions.updateTimeIntervalStart.bind(this),
          style: {width:90},
          value: intervalStart || '0',
        }

        const timeintervalendprops = {
          options: TIMEINTERVAL_OPTIONS,
          onSelect: this._actions.updateTimeIntervalEnd.bind(this),
          style: {width:90},
          value:  intervalEnd || '0',
        }

        const timeintervaldayprops = {
          onChange: this._actions.updateTimeIntervalOn,
          selected: intervalOn,
        }
        
        return  <div className="flexrow">
                  <div className="title"> 
                    <div className="centered">options</div>
                  </div>
                  <div>
                    <div className="flexcolumn">
                      <div>
                        <div className="flexrow">
                          <div className="title"> 
                            <div className="centered">
                              every
                            </div>
                          </div>
                          <div className="fixed" style={{width:50}}>
                            <Select {...timeintervalfrequencyprops} />
                          </div>
                          <div className="title"> 
                            <div className="centered">
                              mins between
                            </div>
                          </div>
                          <div className="fixed" style={{width:90}}>
                             <Select {...timeintervalstartprops} />
                          </div>
                          <div className="title"> 
                            <div className="centered">
                             and
                            </div>
                          </div>
                          <div className="fixed" style={{width:90}}>
                              <Select {...timeintervalendprops} />
                          </div>
                        </div>
                      </div>  
                      <div>
                        <div className="centered">
                          <DayGrid {...timeintervaldayprops}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      }


      renderSpecificTimeOptions(){

        const {local : {specificTime, specificTimeOn}} = this.props;
        
        const timedayprops = {
          onChange: this._actions.updateSpecificTimeOn,
          selected: specificTimeOn,
        }

        const specifictimeprops = {
          id: "time",
          placeholder: "specific time", 
          onChange: (dateString, dateObject, event)=>{this._actions.setSpecificTime(dateObject)},
          value:  moment(specificTime || "12.00", "HH:mm").toDate(),
        }

        return  <div>
                
                  <div className="flexrow">
                    
                    <div className="title"> 
                      <div className="centered">at</div>
                    </div>
                    
                    <div>
                      <div className="centered" style={{padding:8}}>
                        <TimePicker {...specifictimeprops} className="md-cell md-cell--bottom"/>
                      </div>
                    </div>
                  </div>

                  <div className="flexrow">
                    <div className="title"> 
                      <div className="centered">on</div>
                    </div>
                    <div>                 
                      <div className="centered" >
                        <DayGrid{...timedayprops}/>
                      </div>
                    </div>
                  </div>
                
                </div>  
      }

      renderNameAndPayload(){
        
        const {local : {payloadMenu, boolMenu, payloadType, payload, selectedBool}} = this.props;

        const nameprops = {
            id: "name",
            value: this.props.values.name || "",
            onChange: (property, event)=>{
                this.props.updateNode(property, event.target.value);
            },
            selected: this.props.selected,
        }

        const payloadprops = {
            payloadMenu: payloadMenu,
            boolMenu: boolMenu,
            togglePayloadMenu: this._actions.togglePayloadMenu,
            toggleBoolMenu: this._actions.toggleBoolMenu,
            selectPayloadType: this._actions._selectPayloadType,
            payloadType: payloadType,
            payload: payload,
            onChange: this._actions.updatePayload,
            selectBool: this._actions.selectBool,
        }

        return  <div className="flexrow">
                    <div className="title"> 
                      <div className="centered">name</div>
                    </div>
          
                    <div>
                      <div className="centered">
                        <Textfield {...nameprops}/>
                      </div>
                    </div>

                    <div className="title"> 
                      <div className="centered">payload</div>
                    </div>
                
                    <div>
                      <div className="centered">
                        <div>
                          <div className="form-row">
                            <Payload {...payloadprops}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
               
      }

      renderTopic(){
        
        const topicprops = {
            id: "topic",
            value: this.props.values.topic || "",
            onChange: (property, event)=>{
                this.props.updateNode(property, event.target.value);
            },
            selected: this.props.selected,
        }

        return  <div className="flexrow">
                  <div className="title">  
                    <div className="centered">topic</div>
                  </div>
                  <div>
                    <div className="centered">
                      <Textfield {...topicprops}/>
                    </div>
                  </div>
                </div>
      }


      renderRepeat(){
          
          const {local : {repeatOption}} = this.props;

          const repeatprops = {
            options: REPEAT_OPTIONS,

            onSelect: (event)=>{
              this._actions.repeatOptionChanged(event.target.value);
            },
          
            value: repeatOption || 'none',
          }
          
          return <div className="flexrow">
                    <div className="title"> 
                      <div className="centered">repeat</div>
                    </div>
          
                    <div>
                      <div className="centered">
                        <Select {...repeatprops}/>
                      </div>
                    </div>
                  </div>
      }

      render() {
         
        const {local : {repeatOption}} = this.props;
     
        let options = null;

        switch (repeatOption){

          case "none":
            options = this.renderNoneOptions();
            break;

          case "interval":
            options = this.renderIntervalOptions();
            break;

          case "interval-time":
            options =  this.renderIntervalTimeOptions();
            break;

          case "time":
            options =  this.renderSpecificTimeOptions();
            break;

          default:
            options = null;

        }

        return  <div className="flexcolumn">
						      
                  <div>
          				  {this.renderNameAndPayload()} 
                  </div>

          			  <div>
          				  {this.renderTopic()}
          		    </div>
          				
              		<div>
              			{this.renderRepeat()}
                  </div>
                  {options}
                </div>
      }

       _intervalChecked(value){
          if (intervalOn){
            return intervalOn.indexOf(value) != -1;
          }
          return false;
       }

       _specificTimeChecked(value){
          if (specificTimeOn){
            return specificTimeOn.indexOf(value) != -1;
          }
          return false;
       }

       _incrementInterval(options, event){
          //this.props.incrementNodeValueKey(options.property, options.key, options.amount, options.min, options.max);
       }

       _decrementInterval(){
          //this.props.incrementNodeValueKey('repeat', 'frequency', -1, 1);
       }
       
       _selectPayloadType(type){
       	  this._actions.selectPayloadType(type);
       }
}