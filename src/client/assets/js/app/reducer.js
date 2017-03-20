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
};
