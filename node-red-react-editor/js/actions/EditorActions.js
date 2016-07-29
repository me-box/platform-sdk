import * as ActionTypes from '../constants/ActionTypes';
import {getID} from '../utils/nodeUtils';

export function init(){
	return {
		type: ActionTypes.EDITOR_INIT,
		id: getID(),
	}
}