import React, {PropTypes} from 'react';

class Textfield extends React.Component {
	static defaultProps = {
    	icon: "fa fa-tag",
  	};

	render() {
		
		const {value, name, onChange, icon, style={}} = this.props;
		const id = this.props.id || name;
		
		let label;
		
		const props = {
            value: value,
            onChange: onChange.bind(this, id),
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
}

export default Textfield;