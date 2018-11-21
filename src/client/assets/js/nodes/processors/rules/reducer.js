import { combineReducers } from 'redux';
import rules, {NAME as rulesName} from './features/rules';

export default combineReducers({
  [rulesName]: rules,
});