import { createStructuredSelector } from 'reselect';
import {nodesWithTestOutputs} from 'utils/utils';
import {convertNode} from 'utils/nodeUtils';
import request  from 'superagent';
import config from 'config';


export const NAME = 'test';

const TOGGLE_VISIBLE	= 'iot.red/test/TOGGLE_VISIBLE';
const SET_VISIBLE		= 'iot.red/test/SET_VISIBLE';
const DEPLOY 			= 'iot.red/test/DEPLOY';
const MOUSE_UP 			= 'iot.red/test/MOUSE_UP';
const RECEIVED_TESTURL = 'iot.red/test/RECEIVED_TESTURL';


const initialState = {
	visible:false,
	testurl: "",
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

	  case MOUSE_UP:
	  		return {
	  			...state, 
	    		visible:false
	    	};

	  case RECEIVED_TESTURL:
	  		return {
	  			...state,
	  			testurl: action.testurl,
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
	
		if (nodesWithTestOutputs(nodes).length <= 0){
			console.log("not dispatching a test - no outputs that can be tested");
			return;
		}
		
		const channelId = getState().workspace.app.id;
		
		const jsonnodes = nodes.map((node)=>{
			
			const modifier = node.type === "app" ? {appId: channelId} : {}; //inject the appID
			const n = Object.assign({}, convertNode(node, ports), modifier);

			if (n.type==="app"){
				console.log("app to deploy is");
				console.log(n);
			}
			return n;
		});
		
		
		const tabs = getState().workspace.tabs.map((key)=>{    
          return{
              id: tabsById[key].id,
              label: tabsById[key].name,
              type: 'tab'
          }                                                     
    	});
		console.log([...tabs, ...jsonnodes]);
		console.log(`DEPLOYING TO ${config.root}/nodered/flows`);
		
		
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
  					//dispatch(deployError(err));
  				}else{
  					//TODO: make sure server responds!
  					console.log("**** GOT RESPONSE!!*****");
          			console.log(res.body);
          			//dispatch(deployResponse(res.body));
          			
  	 			}
  	 		});		
	}
}

function init(){
	return function (dispatch, getState) {
		if (getState()[NAME].testurl.trim() === ""){
			console.log("requesting testurl");
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

function setVisible(){
	return {
		type: SET_VISIBLE
	}
}

function toggleVisible(){
	return {
		type: TOGGLE_VISIBLE
	}
}

function mouseUp(){
	return {
		type: MOUSE_UP
	}
}

const visible = (state) => state[NAME].visible;

const username = (state)=> {
	console.log(JSON.stringify(state.repos, null, 4));
	return state.repos.currentuser;
}

const nodes = (state) => {
	return nodesWithTestOutputs(Object.keys(state.nodes.nodesById).map(k=>state.nodes.nodesById[k]));
}

const testurl = (state) => state[NAME].testurl;

export const selector = createStructuredSelector({
	nodes,
	visible,
	testurl,
	username,
});

export const actionCreators = {
	init,
	test,
	toggleVisible,
	mouseUp,
}