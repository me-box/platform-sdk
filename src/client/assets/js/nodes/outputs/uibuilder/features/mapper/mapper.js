import { createStructuredSelector } from 'reselect';
import {NAME as CANVASNAME, actionCreators as templateActions} from '../canvas/'
//import {NAME as LIVENAME, actionCreators as liveActions} from '../live'
//import {NAME as SOURCENAME} from '../sources'
//import {DatasourceManager} from '../../datasources';
import {generateId, defaultCode, resolvePath} from 'nodes/outputs/uibuilder/utils';
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const TOGGLE_MAPPER  = 'uibuilder/mapper/TOGGLE_MAPPER';
const MAP_FROM  = 'uibuilder/mapper/MAP_FROM';
const MAP_TO = 'uibuilder/mapper/MAP_TO';
const SELECT_MAPPING = 'uibuilder/mapper/SELECT_MAPPING';
const SUBSCRIBE_MAPPINGS = 'uibuilder/mapper/SUBSCRIBE_MAPPINGS';
const UNSUBSCRIBE_MAPPINGS = 'uibuilder/mapper/UNSUBSCRIBE_MAPPINGS';
const SAVE_TRANSFORMER = 'uibuilder/mapper/SAVE_TRANSFORMER';
const SUBSCRIBED = 'uibuilder/mapper/SUBSCRIBED';
const UNSUBSCRIBED = 'uibuilder/mapper/UNSUBSCRIBED';
const LOAD_MAPPINGS =  'uibuilder/mapper/LOAD_MAPPINGS';
const CREATED_ENTER_SUBSCRIPTION=  'uibuilder/mapper/CREATED_ENTER_SUBSCRIPTION';
const CLEAR_STATE =  'uibuilder/mapper/CLEAR_STATE';

// This will be used in our root reducer and selectors
export const NAME = 'uibuilder/mapper';

// Define the initial state for `shapes` module

let _listeners = [];

const initialState: State = {
	open:true,
	mappings:[],
	from:null,
	to:null,
	selectedMapping: null,
	transformers:{},
}

const createFrom = (action)=>{
	return {sourceId:action.sourceId, key: action.key, path: action.path, type:action.typedef}
}

const createTo = (action)=>{
	return {path:action.path, type:action.shape, property:action.property}
}

const _function_for = (ttype)=>{
	switch (ttype){

		case "attribute":
			return liveActions.updateNodeAttribute;

		case "transform":
			return liveActions.updateNodeTransform;

		case "style":
 			return liveActions.updateNodeStyle;

		default: 
			return null;

	}
}

const _subscribe = (mapping, onData)=>{
	

	var ds = DatasourceManager.get(mapping.from.sourceId);
	
	if (ds){
		
		let count = 0;
		return  ds.emitter.addListener('data', (data)=>{
			onData(mapping, data, count);
    		count+=1;
    	});
	}
}



const _defaultTransform = (type)=>{
	
	switch (type){
		case "rotate":
			return "rotate(0)";

		case "translate":
			return "translate(0,0)";

		case "scale":
			return "scale(1)";

		default:
			return "translate(0,0)";
	}
}

const _getNode = (nodesByKey, nodesById, enterKey, path)=>{
	if (path && path.length >= 1){
		const id 	  = path[path.length-1];
		const key 	  = enterKey || "root";
		const nodeId  = nodesByKey[id] ? nodesByKey[id][key] : null;
		return nodeId ? nodesById[nodeId] : {};
	}
	return {};
}


const _removeSubscriptions = ()=>{

	for (let i = 0; i < _listeners.length; i++){
		_listeners[i].remove();
	}
	_listeners = [];
}
	

export default function reducer(state = initialState, action= {}) {
	switch (action.type){
		
		case TOGGLE_MAPPER:
			return Object.assign({}, state, {open:!state.open});
	
		case MAP_FROM:
			return Object.assign({}, state, {from:createFrom(action)});

		case MAP_TO:
			if (state.from){
				return Object.assign({}, state, {
													mappings: [...state.mappings, {mappingId: action.mappingId, ttype:action.ttype, from:state.from, to:createTo(action) /*nodes:[]*/}],
													from: null,
													to: null,
												})
			}
			return state;

		case SELECT_MAPPING:
			return Object.assign({},state,{selectedMapping:action.mapping});

		case SUBSCRIBE_MAPPINGS:
			_createSubscriptions(state);
			return state;

		case UNSUBSCRIBE_MAPPINGS:
			_removeSubscriptions(state);
			return state;

		case SAVE_TRANSFORMER:
			return Object.assign({},state,{transformers:Object.assign({}, state.transformers, {[action.mappingId]:action.transformer})});

		case LOAD_MAPPINGS:
			return Object.assign({},state, {mappings:action.mappings, transformers:action.transformers, selectedMapping:null, from:null, to:null});

		case CLEAR_STATE:
			return Object.assign({}, state, initialState);

		default:	
			return state;
	}
}

// Action Creators
function toggleMapper() {
  return {
    type: TOGGLE_MAPPER,
  };
}

function mapFrom(sourceId, key, path, type){
	return {
		type: MAP_FROM,
		sourceId,
		key,
		path,
		typedef:type,
	};
}

function mapTo(ttype, path, property){

	return (dispatch,getState)=>{
	
		const template = getState().canvas.templatesById[path[path.length-1]];
		
		const action = {
			type: MAP_TO,
			path,
			ttype,
			property,
			shape: template.type,
			mappingId: generateId(),
			
		}
		dispatch(action);
	}
}

function subscribeMappings(){

	return (dispatch, getState)=>{
		const {mapper:{mappings}} = getState();

		for (let i = 0; i < mappings.length; i++){
			
			const fn = _function_for(mappings[i].ttype);
			if (fn){

				const onData = (mapping, data, count)=>{
					const {live: {nodesByKey, nodesById}, canvas: {templatesById}, mapper:{transformers}} = getState();
					const {mappingId, from: {key},  to:{property}} = mapping;

					const template = templatesById[mapping.to.path[mapping.to.path.length-1]];
					const value   = resolvePath(mapping.from.key, mapping.from.path, data);
					
					let shouldenter = true;
					let enterKey = null;

					if (template.enterFn){
						const {enter,key} = template.enterFn;
						shouldenter = Function(...enter.params, enter.body)(data,count);
						enterKey = 	Function(...key.params, key.body)(data,count);
					}
				
    				const remove   = template.exitFn ?   Function(...template.exitFn.params, template.exitFn.body)(data,count) : null; //template.exitFn(data, count) : false;    				
					const node = _getNode(nodesByKey, nodesById, enterKey, mapping.to.path); 
					
					if (remove){
						dispatch(liveActions.removeNode(node.id, mapping.to.path, enterKey));
					}else if (shouldenter){
						const transformer = transformers[mappingId] || defaultCode(key,property);
						const transform   = Function(key, "node", "i", transformer);	
						dispatch(fn(mapping.to.path,property,transform(value, node, count), enterKey, Date.now(), count));
					}
				}
				_listeners.push(_subscribe(mappings[i], onData));
			}
		}
		dispatch({type: SUBSCRIBED});
	}
}

function unsubscribeMappings(){
	_removeSubscriptions();

	return {
		type: UNSUBSCRIBED
	}
}

function mapToAttribute(path, property){
	return mapTo("attribute", path, property);
}

function mapToStyle(path, property){
	return mapTo("style", path, property);
}

function mapToTransform(path, property){
	return mapTo("transform", path, property);
}

function selectMapping(mapping){
	return {
		type: SELECT_MAPPING,
		mapping,
	}
}

function createEnterSubscription(path, sourceId, sourcepath, enterFn){
	
	return (dispatch,getState)=>{
		_subscribe( {
			from: {
				sourceId,
				path:sourcepath,
			},
			to: {
				path,
			}
		},(mapping,data,count)=>{
			//evaluate the enter function
			const {enter,key} = enterFn;
			const shouldenter = Function(...enter.params, enter.body)(data,count);
			const enterKey = 	Function(...key.params, key.body)(data,count);
			dispatch(liveActions.cloneNode(path,enterKey,count));
		});

		dispatch({
			type: CREATED_ENTER_SUBSCRIPTION,
		});
	}
}

function saveTransformer(mappingId, transformer){
	return (dispatch,getState)=>{
		dispatch(selectMapping(null));
	
		dispatch({
			type: SAVE_TRANSFORMER,
			mappingId,
			transformer,
		})
	}
}

function loadMappings({mappings, transformers}){
	
	return {
		type: LOAD_MAPPINGS,
		mappings,
		transformers,
	}
}

function clearState(){
	unsubscribeMappings();
	return {
		type: CLEAR_STATE,
	}
}

// Selectors
const mapper  = (state,ownProps) => state[ownProps.nid][NAME];
//const sources = (state,ownProps) => state[SOURCENAME];
const canvas = (state,ownProps) => state[ownProps.nid][CANVASNAME];

export const selector = createStructuredSelector({
  [NAME]: mapper,
  // sources,

  //TODO :surely this should be pulled in in the componnet?
  [CANVASNAME]: canvas,
});

export const actionCreators = {
  toggleMapper,
  mapFrom,
  mapToAttribute,
  mapToStyle,
  mapToTransform,
  selectMapping,
  loadMappings,
  saveTransformer,
  subscribeMappings,
  unsubscribeMappings,
  createEnterSubscription,
  clearState,
};