import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import Editor from 'features/editor/components/Editor';
//import {Manifest} from 'features/driver/components/Manifest/';
import Menu from 'features/menu/components/Menu';
//import {Overview} from 'features/driver/components/Overview/';
//import {Author} from 'features/driver/components/Author/';
//import {Hardware} from 'features/driver/components/Hardware/';
//import {Data} from 'features/driver/components/Data/';
//import {Publish} from 'features/driver/components/Publish/';
//import {Resources} from 'features/driver/components/Resources/';
//import Wizard from 'features/driver/components/Wizard';
//import Code from 'features/driver/components/Code';

import NotFoundView from 'components/NotFound';

/*
  <Route path="/driver/manifest" component={Manifest}>
        <IndexRoute component={Overview} />  
        <Route path="/driver/manifest/overview" component={Overview}/>
        <Route path="/driver/manifest/author" component={Author}/>
        <Route path="/driver/manifest/hardware" component={Hardware}/>
        <Route path="/driver/manifest/data" component={Data}/>
        <Route path="/driver/manifest/publish" component={Publish}/>
        <Route path="/driver/manifest/resources" component={Resources}/>
    </Route>
    
    <Route path="/driver/code" component={Code}>
        <IndexRoute component={Wizard} />  
        <Route path="/driver/code/wizard" component={Wizard}/>
    </Route>
      <Redirect from="/driver" to="/driver/manifest"/>
*/

export default (
  <Route path="/" component={App}>
  	<IndexRoute component={Editor} />   
  	<Route path="/menu" component={Menu} />
    <Route path="/app" component={Editor} />
    
  
    
    <Route path="404" component={NotFoundView} />
    
  
    <Redirect from="*" to="404" />
  </Route>
);
