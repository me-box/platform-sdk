import React, {PropTypes} from 'react';

class Select extends React.Component {

  static defaultProps = {
      onSelect: ()=>{console.warn("selected item, but not doing anytthing with it!")},
      style: {},
  };

  static propTypes = {
        options: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired,
  }

	render() {  

    const options = this.props.options.map((option)=>{
        return <option key={option.value} value={option.value}>{option.name}</option>
    });

		return(  <select onChange={this.props.onSelect} value={this.props.value} style={this.props.style}>
                {options}
             </select>);
	}
}

export default Select;