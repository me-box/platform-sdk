import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Editor from './Editor';

export default class Root extends Component {

  render(){
    const { store } = this.props;

    return (
      <Provider store={store}>
      	<div>
          <Editor />
        </div>
      </Provider>
      
    );
  }
}
