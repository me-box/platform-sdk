import {TAB_ADD, TAB_SELECT, TAB_UPDATE, TAB_DELETE} from '../constants/ActionTypes';
import {getID} from '../utils/nodeUtils';

const _createNewTab = function(){
	return {
		type: "tab",
		id: getID(),
		label: "new package",		
	}
}

export function addTab(){
	return {
		type: TAB_ADD,
		tab: _createNewTab(),
	}
}

export function updateTab(id, label){
	return {
		type: TAB_UPDATE,
		id,
		label,
	}
}

export function selectTab(tab){
    return {
      type: TAB_SELECT,
      tab
    }
}

export function deleteTab(id){
	return {
		type: TAB_DELETE,
		id,
	}
}