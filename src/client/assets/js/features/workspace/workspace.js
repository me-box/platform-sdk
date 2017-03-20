import { createStructuredSelector } from 'reselect';
import {getID} from 'utils/nodeUtils';
import {actionCreators as nodeActions} from 'features/nodes/actions';
import {actionCreators as portActions} from 'features/ports';
//import {actionCreators as publisherActions} from 'features/publisher';

const TAB_ADD  = 'iot.red/tabs/TAB_ADD';
const TAB_DELETE  = 'iot.red/tabs/TAB_DELETE';
const TAB_UPDATE  = 'iot.red/tabs/TAB_UPDATE';
const TABS_LOAD  = 'iot.red/tabs/TABS_LOAD';
const TAB_SELECT  = 'iot.red/tabs/TAB_SELECT';

export const NAME = 'workspace';


const initialState = {
	current: null,
	tabs: [],
}

const _replaceTab = (tabs, id, label)=>{
	return tabs.map((tab)=>{
		if (tab.id === id){
			tab.label = label;
		}
		return tab;
	});
};

export default function reducer(state = initialState, action) {
  	switch (action.type) {
	  
	  case TAB_SELECT:
	  	return  Object.assign({}, state, {
	  				current:action.tab
	  			});
	  	
	  case TAB_ADD:
	   
	  	return Object.assign({}, state,  {
	  				tabs:	[...state.tabs, action.tab]	,
	  				current: action.tab,
	  			});
	  
	  case TAB_UPDATE:
	  	return Object.assign({}, state, {
	  			tabs: _replaceTab(state.tabs, state.current.id, action.label),
	  			current: Object.assign({}, state.current, {label:action.label}),
	  	});
	  	
	  case TAB_DELETE:
	  	
	  	return Object.assign({}, state, {
	  				tabs: state.tabs.filter((item)=>{return item.id !== action.id}),
	  				current: state.tabs.reduce((acc,tab)=>{
	  					if (tab.id != action.id)
	  						return tab;
	  					return acc;
	  				},{})
	  	});
	
	  	
	  case TABS_LOAD:
	    
	    if (action.tabs.length > 0){
	    	return Object.assign({}, state, {
	  				tabs:action.tabs,
	  				current: action.tabs[0],
	  		});
	    }
	    return state;
	    
	  	
	  default:
	    return state;
	}
}

const _createNewTab = ()=>{
	return {
		type: "tab",
		id: getID(),
		label: "new package",		
	}
}

function addTab(){
	return (dispatch, getState)=>{
		const tab = _createNewTab();
		dispatch({
			type: TAB_ADD,
			tab: _createNewTab(),
		})
		//dispatch(publisherActions.tabAdd(tab));
	} 
}

function updateTab(id, label){
	return (dispatch, getState)=>{
		dispatch({
			type: TAB_UPDATE,
			id,
			label,
		});
		//dispatch(publisherActions.updateTab(id,label));
	} 
}

function selectTab(tab){
	return (dispatch, getState)=>{
		dispatch({
			type: TAB_SELECT,
			tab,
		});
		//dispatch(publisherActions.selectTab(tab));
	} 
}

//make sure cannot delete last tab by checking tabs length
function deleteTab(id){
	return function (dispatch, getState) {
		if (getState().workspace.tabs.length > 1){
			dispatch({
				type: TAB_DELETE,
				id,
			});
			dispatch(nodeActions.deleteTab());
			dispatch(portActions.deleteTab());
		}
	} 
}

function receiveTabs(tabs){
	return (dispatch, getState)=>{
		dispatch({
			type: TABS_LOAD,
			tabs,
		});
		//dispatch(publisherActions.tabsLoad(tabs));
	} 
}

const workspace = (state) => state[NAME];

export const selector = createStructuredSelector({
  workspace
});

export const actionCreators = {
  addTab,
  updateTab,
  selectTab,
  deleteTab,
  receiveTabs,
};