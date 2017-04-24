import React, { Component, PropTypes } from 'react';
import { Flex,Box } from 'reflexbox';

export default class Attributes extends Component {

	  static propTypes = {
    		attributes: PropTypes.array.isRequired,
    		onSelect: PropTypes.func.isRequired
  	  };

  	  render(){

  	  	const items = this.props.attributes.map((item,i)=>{
  	  		return <Box key={i} onClick={this.props.onSelect.bind(null,item)}>{item}</Box>
  	  	});


  	  	return <Flex flexColumn={true}>{items}</Flex>
  	  }
}