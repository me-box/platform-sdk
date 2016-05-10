import React, {PropTypes} from 'react';
import '../../../style/jquery/style.css';

class Spinner extends React.Component {
  
  static defaultProps = {
      onIncrement: ()=>{console.warn("incremented item, but not doing anytthing with it!")},
      onDecrement: ()=>{console.warn("decrmented item, but not doing anytthing with it!")},
      value: 1,
  };

	render() {

		return( <span className="ui-spinner ui-widget ui-widget-content ui-corner-all">
                	<input id="inject-time-interval-count" className="inject-time-count ui-spinner-input" value={this.props.value}/>
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