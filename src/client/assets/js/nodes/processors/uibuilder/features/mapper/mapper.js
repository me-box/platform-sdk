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
const MAP_DEATH = 'uibuilder/mapper/MAP_DEATH';
const MAP_BIRTH = 'uibuilder/mapper/MAP_BIRTH';
const SELECT_MAPPING = 'uibuilder/mapper/SELECT_MAPPING';
const SAVE_TRANSFORMER = 'uibuilder/mapper/SAVE_TRANSFORMER';
const REMOVE_MAPPING = 'uibuilder/mapper/REMOVE_MAPPING';
const LOAD_MAPPINGS =  'uibuilder/mapper/LOAD_MAPPINGS';
const CREATED_ENTER_SUBSCRIPTION=  'uibuilder/mapper/CREATED_ENTER_SUBSCRIPTION';
const CLEAR_STATE =  'uibuilder/mapper/CLEAR_STATE';

// This will be used in our root reducer and selectors
export const NAME = 'uibuilder_mapper';

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

export default function reducer(state = initialState, action= {}) {
	switch (action.type){
		case INIT:

      		return { 
      			...state,
          		mappings: action.mappings,
          		transformers: action.transformers,
      		}
		
		case TOGGLE_MAPPER:

			return {
						...state, 
						open:!state.open
			}
	
		case MAP_FROM:
			return {
						...state, 
						from:createFrom(action)
					};

		case MAP_TO:
			if (state.from){
				return {
					...state,
					mappings: [...state.mappings, {mappingId: action.mappingId, ttype:action.ttype, from:state.from, to:createTo(action) /*nodes:[]*/}],
					from: null,
					to: null,
					transformers :{
						...state.transformers,
						[action.mappingId]:action.transformer,
					}
				}
			}
			return state;


		case MAP_BIRTH:
			return {
				...state,
				mappings: state.mappings.reduce((acc, item)=>{
					if (item.mappingId === action.mappingId){
						acc.push({...item, birth: action.birth})
					}else{
						acc.push(item);
					}
					return acc;
				},[])
			}
		
		case MAP_DEATH:
			
			return {
				...state,
				mappings: state.mappings.reduce((acc, item)=>{
					if (item.mappingId === action.mappingId){
						acc.push({...item, death: action.death})
					}else{
						acc.push(item);
					}
					return acc;
				},[])
			}

		case SELECT_MAPPING:
			return {...state,selectedMapping:action.mapping};


		case SAVE_TRANSFORMER:
			return {	
						...state,
									
						transformers:{
							...state.transformers, 
							[action.mappingId]:action.transformer
						}
					};

		case LOAD_MAPPINGS:
			return {	...state, 
						mappings:action.mappings, 
						transformers:action.transformers, 
						selectedMapping:null, 
						from:null, 
						to:null
					};

		case CLEAR_STATE:
			return {
					...state, 
					...initialState
			};

		case REMOVE_MAPPING:
			return {

				...state, 
				
				mappings: state.mappings.filter(mapping=>mapping.mappingId != action.mappingId),
				
				transformers:  Object.keys(state.transformers).reduce((acc, key)=>{
					if (key != action.mappingId){
							acc[key] = state.transformers[key];
					}
					return acc;
				},{})
			}

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

function mapBirth(id, mappingId, birth){
	return (dispatch, getState)=>{
		dispatch({	 
			id,
			type: MAP_BIRTH,
			mappingId,
			birth
		});
		dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
	};
}

function mapDeath(id, mappingId, death){
	console.log("IN MAPT DEATH", death);
	
	return (dispatch, getState)=>{
		dispatch({	 
			id,
			type: MAP_DEATH,
			mappingId,
			death
		});
		dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
	};
}

function mapTo(id, ttype, path, property){

	return (dispatch,getState)=>{
		
		if (!getState()[id][NAME].from)
			return;

		const template = getState()[id][CANVASNAME].templatesById[path[path.length-1]];
		

		const action = {
			id,
			type: MAP_TO,
			path,
			ttype,
			property,
			shape: template.type,
			mappingId: generateId(),
			transformer: defaultCode(getState()[id][NAME].from.key,property),
			
		}
		dispatch(action);
		dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
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
		dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
	}
}

function mapToAttribute(id, path, property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"attribute", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
      //build provenance tree
      dispatch(nodeActions.updateNode('tree', _buildTree(id, getState()[id][NAME].mappings, getState().nodes.nodesById, getState().ports.linksById)));
  	}
}

function mapToStyle(id,path,property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"style", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
      //build provenance tree
      dispatch(nodeActions.updateNode('tree', _buildTree(id, getState()[id][NAME].mappings, getState().nodes.nodesById, getState().ports.linksById)));
  	}
}

function mapToTransform(id,path,property){
	return (dispatch, getState)=>{
      dispatch(mapTo(id,"transform", path, property));
      dispatch(nodeActions.updateNode('mappings', getState()[id][NAME].mappings));
      dispatch(nodeActions.updateNode('transformers', getState()[id][NAME].transformers));
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
const mapper  = (state,ownProps) => {
	return state[ownProps.nid][NAME];
}
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
  mapBirth,
  mapDeath,
  mapToAttribute,
  mapToStyle,
  mapToTransform,
  selectMapping,
  loadMappings,
  saveTransformer,
  removeMapping,
  deletePressed,
  clearState,

};