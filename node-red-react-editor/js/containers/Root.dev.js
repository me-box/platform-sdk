import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Editor from './Editor';
import DevTools from './DevTools';


export default class Root extends Component {
  

  render(){
	console.log("Great am in root DEV!!");
    const { store } = this.props;

    return (
      <Provider store={store}>
      	<div>
          <Editor />
          <DevTools />
        </div>
      </Provider>
      
    );
  }
}
