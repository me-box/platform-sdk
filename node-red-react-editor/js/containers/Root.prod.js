import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MainApp from './MainApp';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
  }
}
