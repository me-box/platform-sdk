import React, { Component } from 'react';
import {Link} from 'react-router';

export default class Menu extends Component {
  
  render(){
    const menuItems = ["editor", "counter"]   
    
    return (
      <div>
        <Link to="/">Back</Link>
        <ul>
        	{menuItems.map((item, index)=>(
        		<li key={index}>
        			<Link to={`/${item}`}>{item}</Link>
        		</li>
        	))}
        </ul>
      </div>
    )
  }
}