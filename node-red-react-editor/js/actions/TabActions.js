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

//make sure cannot delete last tab by checking tabs length
export function deleteTab(id){
	return function (dispatch, getState) {
		if (getState().tabs.tabs.length > 1){
			dispatch({
				type: TAB_DELETE,
				id,
			});
		}
	} 
}