import React, { Component } from 'react';
import { Link } from 'react-router';
import { Flex, Box } from 'reflexbox';

export default class Menu extends Component {
	render(){
		return 	<Flex>
					<Box auto><Link to="/app"><img src="images/createapp.svg" width="100%"/></Link></Box>
					<Box auto><Link to="/driver"><img src="images/createdriver.svg" width="100%"/></Link></Box>
				</Flex>
	
	}
}