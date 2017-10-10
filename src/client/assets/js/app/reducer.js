import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import palette, {NAME as paletteName} from 'features/palette';
import editor, {NAME as editorName} from 'features/editor';
import nodes, {NAME as nodesName} from 'features/nodes';
import ports, {NAME as portsName} from 'features/ports';
import workspace, {NAME as workspaceName} from 'features/workspace';
import mouse, {NAME as mouseName} from 'features/mouse';
import repos, {NAME as repoName} from 'features/repos';
import test, {NAME as testName} from 'features/test';
import network, {NAME as networkName} from 'features/network';
import driver, {NAME as driverName} from 'features/driver';
import help, {NAME as helpName} from 'features/help';
import examples, {NAME as examplesName} from 'features/examples';
import risk, {NAME as riskName} from 'features/risk';
import serverconsole, {NAME as serverconsoleName} from 'features/serverconsole';

export default {
  routing,
  [editorName]: editor,
  [paletteName]: palette,
  [workspaceName]: workspace,
  [nodesName] : nodes,
  [portsName]: ports,
  [mouseName]: mouse,
  [repoName]: repos,
  [testName]: test,
  [networkName]: network,
  [helpName] : help,
  [driverName]: driver,
  [examplesName]: examples,
  [riskName]: risk,
  [serverconsoleName]: serverconsole,
};
