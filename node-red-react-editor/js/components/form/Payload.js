import React, {PropTypes} from 'react';

class Payload extends React.Component {

  static defaultProps = {
      onSelect: ()=>{console.warn("selected item, but not doing anytthing with it!")},
      togglePayloadMenu: ()=>{},
      style: {},
      type: 'flow',
      payloadMenu: true,
  };

  static propTypes = { 
      onSelect: PropTypes.func.isRequired,
  }

	render() {  
      
      let props = {
          containerstyle: {marginRight: '0px', marginLeft: '0px'},
          selectstyle: {width: 'auto'},
          triggerstyle: {display: 'none'},
      };
      
     const menu = this.props.payloadMenu ? <div className="red-ui-typedInput-options" style={{top: 35, left: 115, display: 'block'}}>
                                  <a href="#" value="flow" style={{paddingLeft: '18px'}}>flow.</a>
                                  <a href="#" value="global" style={{paddingLeft: '18px'}}>global.</a>
                                  <a href="#" value="str"><img src="images/typedInput/az.png" style={{marginRight: '4px', height: '18px'}}/>string</a>
                                  <a href="#" value="num"><img src="images/typedInput/09.png" style={{marginRight: '4px', height: '18px'}}/>number</a>
                                  <a href="#" value="bool"><img src="images/typedInput/bool.png" style={{marginRight: '4px', height: '18px'}}/>boolean</a>
                                  <a href="#" value="json"><img src="images/typedInput/json.png" style={{marginRight: '4px', height: '18px'}}/>JSON</a>
                                  <a href="#" value="date" style={{paddingLeft: '18px'}}>timestamp</a>
                              </div> : null;


      const boolmenu = null;/*<div className="red-ui-typedInput-options" style={{minWidth: 243, top: 35, left: 155, display: 'block'}}>
                            <a href="#" value="true" style={{paddingLeft: 18}}>true</a>
                            <a href="#" value="false" style={{paddingLeft: 18}}>false</a>
                        </div>*/
          

      switch (this.props.type){
        case 'flow':
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
          break;
        
        case 'string':
          props = Object.assign({}, props, {
             label: <img src="images/typedInput/az.png" style={{marginRight: 4, height: 18}}/>,
             inputstyle: {width: 269, marginRight: 0, marginLeft: 0, display: 'inline-block'},
             spanstyle:  {width:243},
          });
          break;
        
        case 'number':
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
        
        case 'timestamp':
           props = Object.assign({}, props, {
             label: 'timestamp',
             selectstyle: {width: '305px'},
             inputstyle: {width: 300, marginRight: 0, marginLeft: 0, display: 'block'},
             spanstyle:  {width:0},
          });
          break;
      }

      return   <span>
                 {menu}
                 {boolmenu}
                 <div className="red-ui-typedInput-container" style={props.containerstyle}>
                      <a onClick = {this.props.togglePayloadMenu}  style={props.selectstyle}>
                        <i className="fa fa-sort-desc"></i>
                        <span>{props.label}</span>
                      </a>
                      <input type="text" style={props.inputstyle} className="red-ui-typedInput"/>
                        <a href="#" className="red-ui-typedInput-option-trigger" style={props.triggerstyle}>
                            <span style={props.spanstyle}>true</span>
                            <i className="fa fa-sort-desc"></i>
                        </a>
                  </div>
                </span>
           

            
	}
}

export default Payload;