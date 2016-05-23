import React, { Component } from 'react';
import Menu from './Menu';

class Main extends Component {

  constructor(props){
  	super(props);
  }

  

  render() {
    return (
    	<div>
	     	<div>
	     		<Menu/>
	     	</div>
	     	<div>
	     		{this.props.children}
	     	</div>
     	</div>
    );
  }
};

export default Main;
