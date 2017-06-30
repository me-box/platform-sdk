import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import Editor from 'features/editor/components/Editor';
import Driver from 'features/driver/components/Driver';
import Menu from 'features/menu/components/Menu';

//import NotFoundView from 'components/NotFound';

/*<Route path="404" component={NotFoundView} />*/

export default (
  <Route path="/" component={App}>
  	<IndexRoute component={Menu} />   
  	<Route path="/menu" component={Menu} />
    <Route path="/app" component={Editor} />
    <Route path="/driver" component={Driver} />
    <Redirect from="*" to="404" />
  </Route>
);
