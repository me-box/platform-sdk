import { createStructuredSelector } from 'reselect';
import {nodesWithTestOutputs} from 'utils/utils';
import {convertNode} from 'utils/nodeUtils';
import request  from 'superagent';
import config from 'config';


export const NAME = 'test';

const TOGGLE_VISIBLE	= 'iot.red/test/TOGGLE_VISIBLE';
const SET_VISIBLE		= 'iot.red/test/SET_VISIBLE';

const MOUSE_UP 			= 'iot.red/test/MOUSE_UP';
const RECEIVED_TESTURL  = 'iot.red/test/RECEIVED_TESTURL';

const DEPLOYING 		= 'iot.red/test/DEPLOYING';
const DEPLOYED		    = 'iot.red/test/DEPLOYED';
const DEPLOY_ERROR		= 'iot.red/test/DEPLOY_ERROR';

const FOREIGN_MOUSE_UP =  'iot.red/mouse/MOUSE_UP';

const initialState = {
	visible:false,
	testurl: "",
	deploying: false,
	deployError: false,
}
 
export default function reducer(state = initialState, action) {
  	
  	switch (action.type) {

	  case  TOGGLE_VISIBLE:
	    	return {
	    		...state, 
	    		visible:!state.visible,
	    	};
	  
	  case  SET_VISIBLE:
	    	return {
	    		...state,
	    		visible:true
	    	};

	  case FOREIGN_MOUSE_UP:
	  		return {
	  			...state, 
	    		visible:false
	    	};

	  case RECEIVED_TESTURL:
	  		return {
	  			...state,
	  			testurl: action.testurl,
	  		}

	  case DEPLOYING:
			return {
	  			...state,
	  			deploying: true,
	  		}

	  case DEPLOYED:
	  		return {
	  			...state,
	  			deploying:false,
	  			deployError:false,
	  		}

	  case DEPLOY_ERROR:
	  		return {
	  			...state,
	  			deploying:false,
	  			deployError: true,
	  		}

	  default:
	    return state;
	}
}

export function test(){
	
	return function (dispatch, getState) {
		
		dispatch(setVisible());
		
		const nodesById = getState().nodes.nodesById;
		const portsById = getState().ports.linksById;
		const tabsById = getState().workspace.tabsById;
		const nodes = Object.keys(nodesById).map(k=>nodesById[k]);
		const ports = Object.keys(portsById).map(k=>portsById[k]);

		//don't bother deploying if there are no outputs that can be tested (i.e. node.type == "debugger" or node.type === "app"
	
		if (nodesWithTestOutputs(nodes).nodes.length <= 0){
			return;
		}
		
		const channelId = getState().workspace.app.id;
		
		const jsonnodes = nodes.map((node)=>{
			
			const modifier = node.type === "app" ? {appId: channelId} : {}; //inject the appID
			const n = Object.assign({}, convertNode(node, ports), modifier);

			
			return n;
		});
		
		
		const tabs = getState().workspace.tabs.map((key)=>{    
          return{
              id: tabsById[key].id,
              label: tabsById[key].name,
              type: 'tab'
          }                                                     
    	});
	
		dispatch(deploying());

	    request
  			.post(`${config.root}/nodered/flows`)
  			.send([
  					...tabs,
  					...jsonnodes
  				])
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					dispatch(deployError());
  				}else{
  					//TODO: make sure server responds!
  					
          			dispatch(deployed());
   
  	 			}
  	 		});		
	}
}

function init(){
	return function (dispatch, getState) {
		if (getState()[NAME].testurl.trim() === ""){
			
			request
		  		.get(`${config.root}/settings/testurl`)
		  		.set('Accept', 'application/json')
		  		.end(function(err, res){
		  			
		  			const {testurl=""} = res.body;
		  			
		  			dispatch({
		  				type: RECEIVED_TESTURL,
		  				testurl
		  			})
		  		});
		}
	}
}

function deployed(){
	return {
		type: DEPLOYED
	}
}

function deployError(){
	return {
		type: DEPLOY_ERROR
	}
}

function deploying(){
	return {
		type: DEPLOYING
	}
}

function setVisible(){
	return {
		type: SET_VISIBLE
	}
}

function toggleTest(){
	return {
		type: TOGGLE_VISIBLE
	}
}


const visible = (state) => state[NAME].visible && state.nodes.configuringId === null

const username = (state)=> {
	return state.repos.currentuser;
}

const nodestotest = (state) => {
	return nodesWithTestOutputs(Object.keys(state.nodes.nodesById).map(k=>state.nodes.nodesById[k]));
}	

const testurl = (state) => state[NAME].testurl;

const _deploying = (state) => state[NAME].deploying;

const _deployError = (state)=> state[NAME].deployError;

export const selector = createStructuredSelector({
	nodestotest,
	visible,
	testurl,
	username,
	deploying : _deploying,
	deployError: _deployError,
});

export const actionCreators = {
	init,
	test,
	toggleTest,
}