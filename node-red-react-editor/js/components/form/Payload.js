import React, {PropTypes} from 'react';
import {TOOLBAR_HEIGHT, EDITOR_PADDING} from '../../constants/ViewConstants';

class Payload extends React.Component {

	constructor(props){
  		super(props);
    	this._menustyle = this._menustyle.bind(this);
    	this._boolstyle = this._boolstyle.bind(this);
    	
  	} 
  	
  
	render() {  
      
	
     let props = {
          containerstyle: {marginTop: 10, textAlign:'left', marginRight: '0px', marginLeft: '0px'},
          selectstyle: {width: 'auto'},
          triggerstyle: {display: 'none'},
     };
    
     /*
     <a onClick={this.props.selectPayloadType.bind(this, 'flow')} value="flow" style={{paddingLeft: '18px'}}>flow.</a>
     <a onClick={this.props.selectPayloadType.bind(this, 'global')} value="global" style={{paddingLeft: '18px'}}>global.</a>*/
                                  
     const menu =      <div className="red-ui-typedInput-options" style={this._menustyle()}>                             
                                  <a onClick={this.props.selectPayloadType.bind(this, 'str')}  value="str"><img src="images/typedInput/az.png" style={{marginRight: '4px', height: '18px'}}/>string</a>
                                  <a onClick={this.props.selectPayloadType.bind(this, 'num')}  value="num"><img src="images/typedInput/09.png" style={{marginRight: '4px', height: '18px'}}/>number</a>
                                  <a onClick={this.props.selectPayloadType.bind(this, 'bool')} value="bool"><img src="images/typedInput/bool.png" style={{marginRight: '4px', height: '18px'}}/>boolean</a>
                                  <a onClick={this.props.selectPayloadType.bind(this, 'json')} value="json"><img src="images/typedInput/json.png" style={{marginRight: '4px', height: '18px'}}/>JSON</a>
                                  <a onClick={this.props.selectPayloadType.bind(this, 'date')} value="date" style={{paddingLeft: '18px'}}>timestamp</a>
                        </div>;

      const boolmenu = <div id="boolmenu" className="red-ui-typedInput-options" style={this._boolstyle()}>
                            <a onClick={this.props.selectBool.bind(this, 'true')} value="true" style={{paddingLeft: 18}}>true</a>
                           <a onClick={this.props.selectBool.bind(this, 'false')} value="false" style={{paddingLeft: 18}}>false</a>
                        </div>;
          
      switch (this.props.payloadType){
        
        /*case 'flow':
          props = Object.assign({}, props, {
             label:'flow.',
             inputstyle: {width: 257, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:235},
          });
          break;

        case 'global':
          props = Object.assign({}, props, {
             label:'global.',
             inputstyle: {width: 244, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:218},
          });
          break;*/
        
        case 'str':
          props = Object.assign({}, props, {
             label: <img src="images/typedInput/az.png" style={{marginRight: 4, height: 18}}/>,
             inputstyle: {width: 269, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:243},
          });
          break;
        
        case 'num':
          props = Object.assign({}, props, {
             label: <img src="images/typedInput/09.png" style={{marginRight: 4, height: 18}}/>,
             inputstyle: {width: 269, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:243},
          });
          break; 
        
        case 'bool':
          props = Object.assign({}, props, {
             label: <img src="images/typedInput/bool.png" style={{marginRight: 4, height: 18}}/>,
             inputstyle: {width: 269, marginRight: 0, marginLeft: 0, display: 'none'},
             spanstyle:  {width:243},
             triggerstyle: {display: 'inline-block'},
          });
          break;
        
        case 'json':
          props = Object.assign({}, props, {
             label: <img src="images/typedInput/json.png" style={{marginRight: 4, height: 18}}/>,
             inputstyle: {width: 269, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:243},
          });
          break;
        
        case 'date':
           props = Object.assign({}, props, {
             label: 'timestamp',
             selectstyle: {width: '305px'},
             inputstyle: {width: 300, marginRight: 0, marginLeft: 0, display: 'block'},
             spanstyle:  {width:0},
          });
          break;
      }

      return   <span>
                 {this.props.payloadMenu && menu}
                 {this.props.boolMenu && boolmenu}
                 <div ref="payload" className="red-ui-typedInput-container" style={props.containerstyle}>
                      <a onClick = {this.props.togglePayloadMenu}  style={props.selectstyle}>
                        <i className="fa fa-sort-desc"></i>
                        <span>{props.label}</span>
                      </a>
                      <input  type="text" onChange={this.props.onChange} style={props.inputstyle} value={this.props.payload} className="red-ui-typedInput"/>
                        <a onClick={this.props.toggleBoolMenu} className="red-ui-typedInput-option-trigger" style={props.triggerstyle}>
                            <span style={props.spanstyle}>{this.props.payload && this.props.payload === "true" ? "true" : "false"}</span>
                            <i className="fa fa-sort-desc"></i>
                        </a>
                  </div>
                </span>
           

            
	}

	
	_menustyle(){
		
		let brect = {top: 0, left: 0};
		
	 	if (this.refs.payload){
  			brect = this.refs.payload.getBoundingClientRect();
  		}
  		
  		return { 
			top: brect.top - TOOLBAR_HEIGHT - EDITOR_PADDING,
  			left: brect.left - (305 - 102),
  			display: 'block',
  		}
  	}
  	
  	
  	
  	_boolstyle(){
		
		let brect = {top: 0, left: 0};
		
	 	if (this.refs.payload){
  			brect = this.refs.payload.getBoundingClientRect();
  		}
  		
  		return { 
			top: brect.top - TOOLBAR_HEIGHT - EDITOR_PADDING,
  			left: brect.left + 30,
  			display: 'block',
  			
  		}
  	}
}

Payload.menutop = 0;
Payload.left = 0;

Payload.defaultProps = {
      style: {},
      payloadType: 'date',
      payload: '',
      payloadMenu: false,
      onChange: ()=>{},
};

Payload.propTypes = { 
      toggleBoolMenu: PropTypes.func.isRequired,
      togglePayloadMenu: PropTypes.func.isRequired,
      selectPayloadType: PropTypes.func.isRequired,
      selectBool: PropTypes.func.isRequired,
}

export default Payload;