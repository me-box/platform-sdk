import { createStructuredSelector } from 'reselect';

const RECEIVE_SAMPLE_DATA  = 'iot.red/samples/RECEIVE_SAMPLE_DATA';

export const NAME = 'samples';

export default function samples(state = {}, action) {
	switch(action.type){
		case ActionType.RECEIVE_SAMPLE_DATA:
			return Object.assign(state, {}, action.data);
		default:
			return state;
	}
}

function fetchSampleData(datastore){
	
	return function(dispatch){
		request
  			.get(`${config.root}/samples/${datastore}`)
  			.set('Accept', 'application/json')
  			.type('json')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  				}else{
  					 
  					 if (res.body.success){
  						 dispatch({
      						type: RECEIVE_SAMPLE_DATA,
      						data:res.body.data,
      						receivedAt: Date.now()
    	   			 	});
    	   			 }
  	 			}
  	 		});		
	}
}

const samples = (state) => state[NAME];

export const selector = createStructuredSelector({
  samples
});

export const actionCreators = {
  fetchSampleData
};