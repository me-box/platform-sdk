import React, {Component} from 'react';
import {configNode} from 'utils/ReactDecorators'; 
import Cell from 'components/Cell';
import Cells from 'components/Cells';
import Textfield from 'components/form/Textfield';
import Select from 'components/form/Select';

@configNode()              
export default class Node extends Component {

  constructor(props){
    super(props);
    this.renderOp1 = this.renderOp1.bind(this);
    this.renderOp2 = this.renderOp2.bind(this);

    this.renderSendTypeOp1 = this.renderSendTypeOp1.bind(this);
    this.renderSendTypeOp2 = this.renderSendTypeOp2.bind(this);

    this.renderSendValue= this.renderSendValue.bind(this);
    
    this.renderNameInput = this.renderNameInput.bind(this);
    this.renderThen = this.renderThen.bind(this);
    this.renderThenSend = this.renderThenSend.bind(this);
    this.renderReset = this.renderReset.bind(this);
    this.state = {then:"wait"};
  }

  renderOp1(){
    const sendcontent = <div className="flexrow">
                          <div className="fixed" style={{width:200}}>
                            {this.renderSendTypeOp1()}
                          </div>
                          <div>
                            {this.renderSendValue("op1")}
                          </div>
                        </div>

    return <Cell title={"send"} content={sendcontent}/>
  }


  renderOp2(){
    const sendcontent = <div className="flexrow">
                          <div className="fixed" style={{width:200}}>
                              {this.renderSendTypeOp2()}
                          </div>
                          <div>
                            {this.renderSendValue("op2")}
                          </div>
                        </div>
    return <Cell title={"then send"} content={sendcontent}/>
  }

  renderSendValue(field){

    const {values={},updateNode} = this.props;
    
    const valueprops = {
      
      id: field,
      
      placeholder:"value",
      
      value: values[field],

      onChange: (property, event)=>{
        updateNode(field, event.target.value);
      }
    }
        
    return <Textfield {...valueprops}/>   
  }

  renderSendTypeOp1(){
    const {values={},updateNode} = this.props;

    const typeprops = {    

      id: "op1type", 
      placeholder: "send",

      options: [
          {name: 'string', value: 'str'},
          {name: 'number', value: 'num'},
          {name: 'boolean', value: 'bool'},
          {name: 'JSON', value: 'json'},
          {name: 'the existing message', value: 'pay'},
          {name: 'nothing', value: 'nul'}
      ],
      
      label:"send",
      itemLabel:"name",
      itemValue:"value",

      onSelect: (event)=>{
         updateNode("op1type", event.target.value);
      },  
        
      helpText:"select type of message to send",
      value: values.op1type || ""
    }

    return <Select {...typeprops}/>
  }

  renderSendTypeOp2(){
    
    const {values={},updateNode} = this.props;

    const typeprops = {    

      id: "op2type", 
      placeholder: "send",

      options: [
          {name: 'string', value: 'str'},
          {name: 'number', value: 'num'},
          {name: 'boolean', value: 'bool'},
          {name: 'JSON', value: 'json'},
          {name: 'the original message', value: 'pay'},
          {name: 'the latest message', value: 'payl'},
          {name: 'nothing', value: 'nul'}
      ],
      
      label:"send",
      itemLabel:"name",
      itemValue:"value",

      onSelect: (event)=>{
         updateNode("op2type", event.target.value);
      },  
        
      helpText:"select type of message to send",
      value: values.op2type || ""
    }

    return <Select {...typeprops}/>

  }

  renderThen(){

    const {values={},updateNode} = this.props;

    const typeprops = {    

      id: "then", 
      placeholder: "then",

      options: [
          {name: 'wait to be reset', value: 'block'},
          {name: 'wait', value: 'wait'},
      ],
      
      label:"then",
      itemLabel:"name",
      itemValue:"value",

      onSelect: (event)=>{
         this.setState({then:event.target.value})
      },  
        
      helpText:"set whether to wait when a message is received or not",
      value: this.state.then,
    }

    const typeinput = <div className="centered">
                        <Select {...typeprops}/>                        
                      </div>

    return <Cell title={"then"} content={typeinput}/>
  }

  renderThenSend(){
    const {values={},updateNode} = this.props;
    return null;
  }

  renderWaitDuration(){
    const {values={},updateNode} = this.props;

    const durationprops = {
      id: "duration",
      value: values.duration,
      onChange: (property, event)=>{
        updateNode("duration", event.target.value);
      },
      style:{width:40},
    }

    const unitprops = {
      options: [
        {name: 'milliseconds', value: 'ms'},
        {name: 'seconds', value: 's'},
        {name: 'minutes', value: 'min'},
        {name: 'hours', value: 'hr'},
      ],
      onSelect: (event)=>{
         updateNode("units", event.target.value);
      }, 
      style: {width: 100},
      value: values.units ? values.units : 's',
    }
    
    const selectime =  <div className="flexrow">
                          <div className="fixed" style={{width:50}}>
                            <Textfield {...durationprops}/>
                          </div>
                          <div>
                            <Select  {...unitprops}/>
                          </div>
                        </div>

     return <Cell title={"duration"} content={selectime}/>      
  }

  renderNameInput(){

    const {values={},updateNode} = this.props;
    
    const nameprops = {
      
      id: "name",
      
      placeholder:"name",
      
      value: values.name || "",

      onChange: (property, event)=>{
        updateNode(property, event.target.value);
      }
    }
         
    const nameinput = <div className="centered">
                        <Textfield {...nameprops}/>                       
                      </div>
        
    return <Cell title={"name"} content={nameinput}/>   
  }

  renderReset(){
      const {values={},updateNode} = this.props;
      
      const resetprops = {
        id: "reset",
        placeholder:"optional",
        value: values.reset,
        onChange: (property, event)=>{
          updateNode("reset", event.target.value);
        }
      }

      const reset =  <div className="flexrow">
                          <div className="fixed" style={{width:200}}>
                            <div className="centered">msg.reset is set</div>
                          </div>
                          <div className="title"> 
                            <div className="centered">or msg.payload =</div>
                          </div>
                          <div>
                            <Textfield {...resetprops}/>
                          </div>
                        </div>

     return <Cell title={"reset trigger if"} content={reset}/> 
  }
   
  render() {
   
              return <Cells> 
                        {this.renderNameInput()}
                        {this.renderOp1()}
                        {this.renderThen()}
                        {this.state.then === "wait" && this.renderWaitDuration()}
                        {this.renderReset()}
                        {this.renderThenSend()}
                        {this.renderOp2()}
                      </Cells>
   
  }

}