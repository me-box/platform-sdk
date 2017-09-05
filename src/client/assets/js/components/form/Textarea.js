import React, {PropTypes} from 'react';

class Textarea extends React.Component {

	render() {
		
		const {value, id, onChange} = this.props;

		const props = {
            value: value,
            onChange: onChange.bind(this, id),
        }
        const style = {
        	width: '100%',
    		border: 'none',
    		boxShadow: 'none'
        }
		return( 
			  <textarea {...props} style={style}></textarea>
		);
	}
}

export default Textarea;