import React from 'react';
import composeNode from '../../utils/composeNode';
import Textfield from '../../components/Textfield';

class Node extends React.Component {

       render() {
          const payloadprops = Object.assign({}, this.props, {name:"name"});
          const topicProps   = Object.assign({}, this.props, {name:"topic"});
          const nameProps   = Object.assign({}, this.props, {name:"name"});
          return  <div>
                      <div className="form-row">
                          <label for="node-input-payload"><i className="fa fa-envelope"></i> <span data-i18n="common.label.payload"></span></label>
                          <input type="text" id="node-input-payload" style={{width:300}}/>
                          <input type="hidden" id="node-input-payloadType"/>
                      </div>

                      <div className="form-row">
                          <label for="node-input-topic"><i className="fa fa-tasks"></i> <span data-i18n="common.label.topic"></span></label>
                          <input type="text" id="node-input-topic" style={{width: '70%'}}/>
                      </div>

                      <div className="form-row">
                          <label for=""><i className="fa fa-repeat"></i> <span data-i18n="inject.label.repeat"></span></label>
                          <select id="inject-time-type-select" style={{width: '73%'}}>
                              <option value="none" data-i18n="inject.none"></option>
                              <option value="interval" data-i18n="inject.interval"></option>
                              <option value="interval-time" data-i18n="inject.interval-time"></option>
                              <option value="time" data-i18n="inject.time"></option>
                          </select>
                          <input type="hidden" id="node-input-repeat"/>
                          <input type="hidden" id="node-input-crontab"/>
                      </div>

                      <div className="form-row inject-time-row hidden" id="inject-time-row-interval">
                          <span data-i18n="inject.every"></span>
                          <input id="inject-time-interval-count" className="inject-time-count" value="1"/>
                          <select style={{width: 100}} id="inject-time-interval-units">
                              <option value="s" data-i18n="inject.seconds"></option>
                              <option value="m" data-i18n="inject.minutes"></option>
                              <option value="h" data-i18n="inject.hours"></option>
                          </select><br/>
                      </div>

                      <div className="form-row inject-time-row hidden" id="inject-time-row-interval-time">
                          <span data-i18n="inject.every"></span> <select style={{width: 90}} id="inject-time-interval-time-units" className="inject-time-int-count" value="1">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="10">10</option>
                              <option value="12">12</option>
                              <option value="15">15</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value="0">60</option>
                          </select> 
                          <span data-i18n="inject.minutes"></span><br/>
                          <span data-i18n="inject.between"></span> 
                          <select id="inject-time-interval-time-start" className="inject-time-times"></select>
                          <span data-i18n="inject.and"></span> 
                          <select id="inject-time-interval-time-end" className="inject-time-times"></select><br/>
                          <div id="inject-time-interval-time-days" className="inject-time-days">
                              <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: '5px'}} data-i18n="inject.on">on</div>
                              <div style={{display:'inline-block'}}>
                                  <div>
                                      <label><input type='checkbox' checked value='1'/> <span data-i18n="inject.days.0"></span></label>
                                      <label><input type='checkbox' checked value='2'/> <span data-i18n="inject.days.1"></span></label>
                                      <label><input type='checkbox' checked value='3'/> <span data-i18n="inject.days.2"></span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='4'/> <span data-i18n="inject.days.3"></span></label>
                                      <label><input type='checkbox' checked value='5'/> <span data-i18n="inject.days.4"></span></label>
                                      <label><input type='checkbox' checked value='6'/> <span data-i18n="inject.days.5"></span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='0'/> <span data-i18n="inject.days.6"></span></label>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="form-row inject-time-row hidden" id="inject-time-row-time">
                          <span data-i18n="inject.at"></span> <input id="inject-time-time" value="12:00"/><br/>
                          <div id="inject-time-time-days" className="inject-time-days">
                              <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: 5}}>on </div>
                              <div style={{display:'inline-block'}}>
                                  <div>
                                      <label><input type='checkbox' checked value='1'/> <span data-i18n="inject.days.0"></span></label>
                                      <label><input type='checkbox' checked value='2'/> <span data-i18n="inject.days.1"></span></label>
                                      <label><input type='checkbox' checked value='3'/> <span data-i18n="inject.days.2"></span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='4'/> <span data-i18n="inject.days.3"></span></label>
                                      <label><input type='checkbox' checked value='5'/> <span data-i18n="inject.days.4"></span></label>
                                      <label><input type='checkbox' checked value='6'/> <span data-i18n="inject.days.5"></span></label>
                                  </div>
                                  <div>
                                      <label><input type='checkbox' checked value='0'/> <span data-i18n="inject.days.6"></span></label>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="form-row" id="node-once">
                          <label>&nbsp;</label>
                          <input type="checkbox" id="node-input-once" style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}}/>
                          <label for="node-input-once" style={{width: '70%'}} data-i18n="inject.onstart"></label>
                      </div>

                      <div className="form-row">
                          <label for="node-input-name"><i className="fa fa-tag"></i> <span data-i18n="common.label.name"></span></label>
                          <input type="text" id="node-input-name" data-i18n="[placeholder]common.label.name"/>
                      </div>

                      <div className="form-tips" data-i18n="[html]inject.tip"></div>
                  </div>
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

        oneditprepare: function() {
            //dont think we need this crazy shit!
        },

        oneditsave: function() {
           
        },

        button: {
            onclick: function() {
               
            }
        },
   }
);