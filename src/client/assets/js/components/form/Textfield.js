import React, {PropTypes} from 'react';

class Textfield extends React.Component {
	static defaultProps = {
    	icon: "fa fa-tag",
    	onChange: null,
    	onBlur: ()=>{},
  	};

  	constructor(props){
  		super(props);
  		this._onKeyPress = this._onKeyPress.bind(this);
  		this._onChange = this._onChange.bind(this);
  		this._onBlur = this._onBlur.bind(this);
  		this.state = {value:this.props.value, focussed: false}
  	}


	render() {
		
		const {name, value, onChange, onBlur, icon, style={width: '100%',border: 'none', boxShadow: 'none'}} = this.props;
		const id = this.props.id || name;
		
		let label;
		
		const props = {
            value: this.state.focussed ? this.state.value : value,
            onChange: this._onChange,
            onBlur: this._onBlur,
            onFocus: ()=>this.setState({focussed:true, value:value}),
            onKeyPress: this._onKeyPress,
            placeholder: this.props.placeholder || "",
        }
        
        if (name && icon){
        	label = <label>
	                  <i className={this.props.icon}></i>
	                  <span data-i18n="common.label.name">{name}</span>
	              	</label>
		}
		return( 
			  <div>
				  {label}		 
	              <input style={style} type="text" {...props}/>
			  </div>
		);
	}

	_onBlur(e){
		this.setState({focussed:false, value:e.target.value});
		this.props.onBlur(this.props.id, e);
	}

	_onChange(e){
		
		this.setState({value:e.target.value});

		if (this.props.onChange){
			this.props.onChange(this.props.id, e);
		}

	}

	_onKeyPress(e){
		if (e.key === 'Enter') {
			this.setState({value:e.target.value});
			this.props.onBlur(this.props.id,event);
		}
	}
}

export default Textfield;