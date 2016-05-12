import React, {PropTypes} from 'react';

class Textfield extends React.Component {
	static defaultProps = {
    	icon: "fa fa-tag",
  	};

	render() {
		
		const {value, selected, name, onChange, icon} = this.props;

		const props = {
            value: value,
            onChange: onChange.bind(this, name),
        }

		return( 
			  <div>
				  <label>
	                  <i className={this.props.icon}></i>
	                  <span data-i18n="common.label.name">{name}</span>
	              </label>
	              <input type="text" {...props}/>
			  </div>
		);
	}
}

export default Textfield;