import React, { Component } from 'react';

export default class Category extends Component {
  
  render(){
    const category = data.lookupCategory(this.props.params.category);    
    
    return (
      <div>
        <h1>{category.name}</h1>
        {this.props.children}
      </div>
    )
  }
}