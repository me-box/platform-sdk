import * as ActionTypes from '../constants/ActionTypes';
import {getID} from '../utils/nodeUtils';

export function initEditor(){
	return {
		type: ActionTypes.EDITOR_INIT,
		id: getID(),
	}
}