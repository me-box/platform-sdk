import { createStructuredSelector } from 'reselect';
import {NAME as CANVASNAME, actionCreators as templateActions} from '../canvas/'
//import {NAME as LIVENAME, actionCreators as liveActions} from '../live'
//import {NAME as SOURCENAME} from '../sources'
//import {DatasourceManager} from '../../datasources';
import {generateId, defaultCode, resolvePath} from 'nodes/processors/uibuilder/utils';
// Action Types
import {actionCreators as nodeActions} from 'features/nodes/actions';
// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const INIT = 'uibuilder/mapper/INIT';
const TOGGLE_MAPPER  = 'uibuilder/mapper/TOGGLE_MAPPER';
const MAP_FROM  = 'uibuilder/mapper/MAP_FROM';
const MAP_TO = 'uibuilder/mapper/MAP_TO';
const SELECT_MAPPING = 'uibuilder/mapper/SELECT_MAPPING';
const SAVE_TRANSFORMER = 'uibuilder/mapper/SAVE_TRANSFORMER';
const REMOVE_MAPPING = 'uibuilder/mapper/REMOVE_MAPPING';
const LOAD_MAPPINGS =  'uibuilder/mapper/LOAD_MAPPINGS';
const CREATED_ENTER_SUBSCRIPTION=  'uibuilder/mapper/CREATED_ENTER_SUBSCRIPTION';
const CLEAR_STATE =  'uibuilder/mapper/CLEAR_STATE';

// This will be used in our root reducer and selectors
export const NAME = 'uibuilder_mapper';

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

const _parent = (node)=>{
	if (!node.inputs){
		return [];
	}
	return {

	}
}

const _hexEncode = (str)=>{
    var hex, i;

    var result = "";
    for (i=0; i<str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

const _provenance_data = (nid, nodes)=>{
	return {
		nid,
		type: nodes[nid].type,
		category: nodes[nid]._def.category,
		color: nodes[nid]._def.color,
		unicode: _hexEncode(nodes[nid]._def.unicode)
	}
}

const _reverseTree = (nid, links, nodes)=>{

	return Object.keys(links).reduce((acc, key)=>{
		const link = links[key];
		if (link.target.id === nid){
			acc.push({node:_provenance_data(link.source.id,nodes), parents: _reverseTree(link.source.id,links,nodes)});
		}
		return acc;
	},[]);
}

const _buildTree = (nid, mappings, nodes, links)=>{
	
	//first build the tree from this node upwards
	const leaves = mappings.map( (mapping)=>{ return {id:mapping.mappingId, nid:mapping.from.sourceId}});

	return leaves.reduce((acc, mapping)=>{
		acc[mapping.id] = {
									node:_provenance_data(nid, nodes), 
									parents: [{node: _provenance_data(mapping.nid,nodes), parents: _reverseTree(mapping.nid, links, nodes)}]
						  };
		return acc;
	},{});
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

	

export default function reducer(state = initialState, action= {}) {
	switch (action.type){
		case INIT:

      		return Object.assign({}, state, {
          		mappings: action.mappings,
          		transformers: action.transformers,
      		});
		
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


		case SAVE_TRANSFORMER:
			return Object.assign({},state,{transformers:Object.assign({}, state.transformers, {[action.mappingId]:action.transformer})});

		case LOAD_MAPPINGS:
			return Object.assign({},state, {mappings:action.mappings, transformers:action.transformers, selectedMapping:null, from:null, to:null});

		case CLEAR_STATE:
			return Object.assign({}, state, initialState);

		case REMOVE_MAPPING:
			return Object.assign({}, state, {
				mappings: state.mappings.filter(mapping=>mapping.mappingId != action.mappingId),
				transformers:  Object.keys(state.transformers).reduce((acc, key)=>{
					if (key != action.mappingId){
						acc[key] = state.transformers[key];
					}
					return acc;
				},{})
			})
		default:	
			return state;
	}
}

// Action Creators
function toggleMapper(id) {
  return {
  	id,
    type: TOGGLE_MAPPER,
  };
}

function mapFrom(id, sourceId, key, path, type){
	return {
		id,
		type: MAP_FROM,
		sourceId,
		key,
		path,
		typedef:type,
	};
}

function mapTo(id, ttype, path, property){

	return (dispatch,getState)=>{
	
		const template = getState()[id][CANVASNAME].templatesById[path[path.length-1]];
		
		const action = {
			id,
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

function subscribeMappings(id){

	return (dispatch, getState)=>{
		const {mapper:{mappings}} = getState();

		for (let i = 0; i < mappings.length; i++){
			
			const fn = _function_for(mappings[i].ttype);
			if (fn){

				const onData = (mapping, data, count)=>{
					
					const {live: {nodesByKey, nodesById}, canvas: {templatesById}, mapper:{transformers}, editor:{screen}} = getState();
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
						dispatch(liveActions.removeNode(id, node.id, mapping.to.path, enterKey));
					}else if (shouldenter){
						const transformer = transformers[mappingId] || defaultCode(key,property);
						const transform   = Function("id", key, "node", "i", "w", "h", transformer);	
						//TODO: do we need id here?
						dispatch(fn(mapping.to.path,property,transform(enterKey||"root", value, node, count, screen.w, screen.h), enterKey, Date.now(), count));
					}
				}
				_listeners.push(_subscribe(mappings[i], onData));
			}
		}
		dispatch({id,type: SUBSCRIBED});
	}
}

function removeMapping(id, mappingId){
	return (dispatch, getState)=>{
		dispatch({id,type: REMOVE_MAPPING,mappingId});
		dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
	}
}

function deletePressed(id, templateId){

	return (dispatch, getState)=>{
		const todelete = getState()[id][NAME].mappings.filter(mapping=>mapping.to.path[mapping.to.path.length-1] === templateId).map(item=>item.mappingId);
		
		todelete.map((mappingId)=>{
			dispatch(removeMapping(id, mappingId));
		});
		dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
	}
}

function mapToAttribute(id, path, property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"attribute", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      //build provenance tree
      dispatch(nodeActions.updateNode('tree', _buildTree(id, getState()[id][NAME].mappings, getState().nodes.nodesById, getState().ports.linksById)));
  	}
}

function mapToStyle(id,path, property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"style", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      //build provenance tree
      dispatch(nodeActions.updateNode('tree', _buildTree(id, getState()[id][NAME].mappings, getState().nodes.nodesById, getState().ports.linksById)));
  	}
}

function mapToTransform(id,path, property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"transform", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      //build provenance tree
      dispatch(nodeActions.updateNode('tree', _buildTree(id, getState()[id][NAME].mappings, getState().nodes.nodesById, getState().ports.linksById)));
  	}
}

function selectMapping(id,mapping){
	return {
		id,
		type: SELECT_MAPPING,
		mapping,
	}
}


function createEnterSubscription(id,path, sourceId, sourcepath, enterFn){
	
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
			dispatch(liveActions.cloneNode(id,path,enterKey,count));
		});

		dispatch({
			id,
			type: CREATED_ENTER_SUBSCRIPTION,
		});
	}
}

function saveTransformer(id, mappingId, transformer){


	return (dispatch,getState)=>{
		dispatch(selectMapping(id, null));
	
		dispatch({
			id,
			type: SAVE_TRANSFORMER,
			mappingId,
			transformer,
		})

		dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
	}
}

function loadMappings(id,{mappings, transformers}){
	
	return {
		id,
		type: LOAD_MAPPINGS,
		mappings,
		transformers,
	}
}

function clearState(id){
	unsubscribeMappings();
	return {
		id,
		type: CLEAR_STATE,
	}
}


function init(id, mappings, transformers){

	return {
		id,
		type: INIT,
		mappings, 
		transformers,
	}
}
// Selectors
const mapper  = (state,ownProps) => state[ownProps.nid][NAME];
//const sources = (state,ownProps) => state[SOURCENAME];
const canvas = (state,ownProps) => state[ownProps.nid][CANVASNAME];

const template = (state, ownProps)=> {
	
	if (state[ownProps.nid][CANVASNAME].selected){
		if (state[ownProps.nid][CANVASNAME].selected.path){
			if (state[ownProps.nid][CANVASNAME].selected.path.length > 0){
				const templateId = state[ownProps.nid][CANVASNAME].selected.path[state[ownProps.nid][CANVASNAME].selected.path.length-1];
				return state[ownProps.nid][CANVASNAME].templatesById[templateId];
			}
		}
	}
	return null;
}

export const selector = createStructuredSelector({
  [NAME]: mapper,
  [CANVASNAME]: canvas,
  template,
});

export const actionCreators = {
  init,
  toggleMapper,
  mapFrom,
  mapToAttribute,
  mapToStyle,
  mapToTransform,
  selectMapping,
  loadMappings,
  saveTransformer,
  subscribeMappings,
  removeMapping,
  deletePressed,
  createEnterSubscription,
  clearState,
};