import React, { Component } from 'react';
import Menu from './Menu';

class Main extends Component {
  render() {
     console.log("in main, context is");
     console.log(this.context);
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
