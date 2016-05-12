import React, {PropTypes} from 'react';
import '../../../style/jquery/style.css';
import {default as cx} from 'classnames';
class Spinner extends React.Component {
  
  static defaultProps = {
      onIncrement: ()=>{console.warn("incremented item, but not doing anytthing with it!")},
      onDecrement: ()=>{console.warn("decrmented item, but not doing anytthing with it!")},
      classes : ['inject-time-count'],
      style: {},
      value: 1,
  };

	render() {

    

    /*<span class="ui-spinner ui-widget ui-widget-content ui-corner-all">
        <input id="inject-time-time" defaultValue="12:00" class="ui-spinner-input">
        <a class="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only">
        <span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span></a><a class="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span></a></span>
		*/

    let className = Object.assign({}, {'ui-spinner-input':true}, this.props.classes.reduce((acc,classname)=>{acc[classname] = true; return acc}, {}))

    return( <span className="ui-spinner ui-widget ui-widget-content ui-corner-all">
                	<input className={cx(className)} value={this.props.value} style={this.props.style}/>
                    <a onClick={this.props.onIncrement} className="ui-spinner-button ui-spinner-up ui-corner-tr ui-button ui-widget ui-state-default ui-button-text-only">
                      <span className="ui-button-text">
                        <span className="ui-icon ui-icon-triangle-1-n" style={{width:16, height:16}}></span>
                      </span>
                    </a>
                    <a onClick={this.props.onDecrement} className="ui-spinner-button ui-spinner-down ui-corner-br ui-button ui-widget ui-state-default ui-button-text-only">
                      <span className="ui-button-text">
                        <span className="ui-icon ui-icon-triangle-1-s"></span>
                      </span>
                    </a>
                </span>);
	}
}

export default Spinner;