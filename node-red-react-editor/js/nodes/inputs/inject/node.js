import React from 'react';
import moment from 'moment';
import composeNode from '../../../utils/composeNode';
import Textfield from '../../../components/form/Textfield';
import Spinner from  '../../../components/form/Spinner';
import Select from '../../../components/form/Select';
import DayGrid from '../../../components/form/DayGrid';
import Payload from '../../../components/form/Payload';
import { connect } from 'react-redux';
import {reducer} from './reducer';
import { bindActionCreators } from 'redux';
import { bindNodeIds } from '../../../utils/utils';
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
            this._intervalChecked = this._intervalChecked.bind(this);
            this._specificTimeChecked = this._specificTimeChecked.bind(this);
       }
       

       render() {
          //local is all of the stuff in its reducer
          const {local} = this.props;
          const {repeatOption, payloadMenu, boolMenu, payloadType, payload, selectedBool} = local;
        

          const nameprops = {
              id: "name",
              value: this.props.values.name || "",
              //icon: "fa fa-tag",
              onChange: (property, event)=>{
                  this.props.updateNode(property, event.target.value);
              },
              selected: this.props.selected,
          }

          const topicprops = {
              id: "topic",
              value: this.props.values.topic || "",
              //icon: "fa fa-tasks",
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
          }

          const repeatprops = {
            options: REPEAT_OPTIONS,

            onSelect: (event)=>{
              this.repeatOptionChanged(event.target.value);
              //this.props.updateNode('repeat', REPEAT_DEFAULT_OBJECTS[event.target.value] || {});
            },
            
            value: local.repeatOption || 'none',
          }
       
          /******** props for 'interval' components ************/

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
            style: {width:90},
            value: local.intervalFrequency || 1,
          }

          const timeintervalstartprops = {
            options: TIMEINTERVAL_OPTIONS,
            onSelect: this.updateTimeIntervalStart.bind(this),
            style: {width:90},
            value: local.intervalStart || '0',
          }

          const timeintervalendprops = {
            options: TIMEINTERVAL_OPTIONS,
            onSelect: this.updateTimeIntervalEnd.bind(this),
            style: {width:90},
            value:  local.intervalEnd || '0',
          }

          const timeintervaldayprops = {
            onChange: this.updateTimeIntervalOn,
            selected: this.props.local.intervalOn,
          }

          /******** props for 'time' components ************/
          const timespinnerprops = {
            //these inceremant. decrement should be handled in the local actions!! then pased on to the main later!
            onIncrement: this.incrementSpecificTime.bind(this,1),//generalise this
            onDecrement: this.incrementSpecificTime.bind(this,-1),
            value: local.specificTime || "12.00",
            classes : [],
            style: {width: 75},
          }

          const timedayprops = {
            onChange: this.updateSpecificTimeOn,
            selected: this.props.local.specificTimeOn,
          }

          let options = null;

          switch (repeatOption){

            case "none":
              
              options = <div>
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
												 	<input type="checkbox" checked={local.once || false} onChange={this.updateOnce.bind(this)} style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
												</div>
											</div>
										</div>
									</div>
								</div>
          					</div>          					
          				</div>
              

              break;

            case "interval":
              
              options = <div className="flexrow">
          					<div className="title">	
								<div className="centered">options</div>
							</div>
							<div>
								<div className="flexcolumn">	
									
									<div>
          								<div className="centered">
          									<span>every</span>
          									<Spinner {...intervalspinnerprops} />
          									<Select  {...unitprops}/>
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
												 	<input type="checkbox" checked={local.once || false} onChange={this.updateOnce.bind(this)} style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
												</div>
											</div>
										</div>
									</div>
									
								</div>
          					</div>   
          					       					
          				</div>
              
              
              
              			
                break;

            case "interval-time":

               options =  <div className="flexrow">
               					<div className="title">	
									<div className="centered">options</div>
								</div>
								<div>
									<div className="flexcolumn">
										<div>
											<div className="centered">
												<span>every</span>
												<Select {...timeintervalfrequencyprops} />
												<span>mins between</span> 
												<Select {...timeintervalstartprops} />
												<span>and</span>
												<Select {...timeintervalendprops} />
											</div>
										</div>
										<div>
											<div className="form-row inject-time-row" >
												<DayGrid {...timeintervaldayprops}/>
											</div>
										</div>
									</div>
								</div>
               			  </div>
                break;

            case "time":
                options =   <div>
								<div className="flexrow">
									<div className="title">	
										<div className="centered">at</div>
									</div>
									<div>
										<div className="centered">
											<Spinner {...timespinnerprops} />
										</div>
									</div>
								</div>
								<div className="flexrow">
									<div className="title">	
										<div className="centered">on</div>
									</div>
									<div>									
										<div className="form-row inject-time-row" >
											<DayGrid{...timedayprops}/>
										</div>
									</div>
								</div>
							</div>	
                				
                  break;

              default:
                 options = null;

          }


          return  	<div className="flexcolumn">
						<div>
          					<div className="flexrow">
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
          				</div>
          				
          				
          				<div>
          					<div className="flexrow">
          						<div className="title">	
									<div className="centered">repeat</div>
								</div>
					
								<div>
									<div className="centered">
										<Select {...repeatprops}/>
									</div>
								</div>
          					</div>
          				</div>
          				
          				{options}
          				
          				
          				
          			</div>
          	
          
          
          
          
        
       }

       _intervalChecked(value){
          if (this.props.local && this.props.local.intervalOn){
            return this.props.local.intervalOn.indexOf(value) != -1;
          }
          return false;
       }

       _specificTimeChecked(value){
          if (this.props.local && this.props.local.intervalOn){
            return this.props.local.specificTimeOn.indexOf(value) != -1;
          }
          return false;
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

        color:"#d40000",

        defaults: {
            name: {value:"inject"},
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

        icon: "fa-clock-o",
        
        unicode: '\uf017',   
        
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

        description: "<p>Pressing the button on the left side of the node allows a message on a topic to be injected into the flow.</p> <p>The payload defaults to the current time in millisecs since 1970, but can also be set to various other javascript types.</p> <p>The repeat function allows the payload to be sent on the required schedule.</p><p>The <i>Inject once at start</i> option actually waits a short interval before firing to give other nodes a chance to instantiate properly.</p><p>The <i>Flow</i> and <i>Global</i> options allow one to inject a flow or global context value.</p> <p><b>Note: </b>'Interval between times' and 'at a specific time' uses cron. This means that 20 minutes will be at the next hour, 20 minutes past and 40 minutes past - not in 20 minutes time. If you want every 20 minutes from now - use the 'interval' option.</p><p><b>Note: </b>all string input is escaped. To add a carriage return to a string you should use a following function.</p>",

        labelStyle: function() {
            return this.name?"node_label_italic":"";
        },

        button: {
            onclick: function() {
               
            }
        },

   }, reducer
);