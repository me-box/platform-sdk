import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import Editor from 'features/editor/components/Editor';
//import NotFoundView from 'components/NotFound';

/*<Route path="404" component={NotFoundView} />*/

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Editor} />    
    <Redirect from="*" to="404" />
  </Route>
);
