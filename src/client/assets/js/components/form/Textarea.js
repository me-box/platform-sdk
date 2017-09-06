import React, {PropTypes} from 'react';

class Textarea extends React.Component {

	render() {
		
		const {value, id, onChange, style={width: '100%',border: 'none', boxShadow: 'none'}} = this.props;

		const props = {
            value: value,
            onChange: onChange.bind(this, id),
        }
        
		return( 
			  <textarea {...props} style={style}></textarea>
		);
	}
}

export default Textarea;