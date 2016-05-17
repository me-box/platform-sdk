import React, {PropTypes} from 'react';

class DayGrid extends React.Component {
	
	static defaultProps = {
      onChange: ()=>{console.warn("doing nothing with onChange in daygrid!")},
   	  selected: [],
	};


	constructor(props){
        super(props);
        this._amChecked = this._amChecked.bind(this);
    }

	render() {

		return  <div id="inject-time-interval-time-days" className="inject-time-days">
			<div style={{display: 'inline-block', verticalAlign: 'top', marginRight: '5px'}} data-i18n="inject.on">on</div>
			<div style={{display:'inline-block'}}>
			  <div>
			      <label><input type='checkbox' value='1' checked={this._amChecked('1')} onChange={this.props.onChange.bind(this)}/><span data-i18n="inject.days.0">Monday</span></label>
			      <label><input type='checkbox' value='2' checked={this._amChecked('2')} onChange={this.props.onChange.bind(this)}/><span data-i18n="inject.days.1">Tuesday</span></label>
			      <label><input type='checkbox' value='3' checked={this._amChecked('3')} onChange={this.props.onChange.bind(this)}/><span data-i18n="inject.days.2">Wednesday</span></label>
			  </div>
			  <div>
			      <label><input type='checkbox' value='4' checked={this._amChecked('4')} onChange={this.props.onChange.bind(this)}/> <span data-i18n="inject.days.3">Thursday</span></label>
			      <label><input type='checkbox' value='5' checked={this._amChecked('5')} onChange={this.props.onChange.bind(this)}/> <span data-i18n="inject.days.4">Friday</span></label>
			      <label><input type='checkbox' value='6' checked={this._amChecked('6')} onChange={this.props.onChange.bind(this)}/> <span data-i18n="inject.days.5">Saturday</span></label>
			  </div>
			  <div>
			      <label><input type='checkbox' value='0' checked={this._amChecked('0')} onChange={this.props.onChange.bind(this)}/> <span data-i18n="inject.days.6">Sunday</span></label>
			  </div>
			</div>
		</div>
	}


	_amChecked(value){
        return this.props.selected.indexOf(value) != -1;
    }
}

export default DayGrid;