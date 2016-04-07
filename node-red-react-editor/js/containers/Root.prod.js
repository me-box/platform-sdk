import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Editor from './Editor';
import MainApp from './MainApp';
import Main from './Main';
import { Router, Route, browserHistory } from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

export default class Root extends Component {
  
  render(){

    const { store } = this.props;

    const history = syncHistoryWithStore(browserHistory, store);
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            <Route path="/" component={Main}>
              <Route path="editor" component={Editor}/>
              <Route path="counter" component={MainApp}/>
              
            </Route>
          </Router>
        </div>
      </Provider>
    );
  }
}