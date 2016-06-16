import React, {PropTypes} from 'react';

class Textarea extends React.Component {

	render() {
		
		const {value, id, onChange} = this.props;

		const props = {
            value: value,
            onChange: onChange.bind(this, id),
        }

		return( 
			  <textarea {...props}></textarea>
		);
	}
}

export default Textarea;