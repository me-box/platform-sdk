import React from 'react';

class Textfield extends React.Component {
	
	render() {
		
		const {values, selected, name, onChange} = this.props;

		const props = {
            value: values[name] || selected[name] || "",
            onChange: onChange.bind(this, name),
        }

		return( 
			  <div>
				  <label>
	                  <i className="fa fa-tag"></i>
	                  <span data-i18n="common.label.name">{name}</span>
	              </label>
	              <input type="text" {...props}/>
			  </div>
		);
	}
}

export default Textfield;