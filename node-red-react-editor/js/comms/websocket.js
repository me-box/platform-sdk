import {debugMessage} from '../actions/AppActions';
let socket;

//appId is used to create the websocket room  -- but this is no longer needed as is part of the test app!
export function init(namespace, appId, dispatch) {
  console.log("initing websokcet!"); 
  socket = io('/'+namespace, {path: '/app/socket.io'});
  
  
  socket.on("connect", function(){
  	  console.log("joining on : " + appId);
      socket.emit("join", appId);
  });

  socket.on("message", function(data){
    console.log(data);
    //dispatch(debugMessage(data));
  });
};

export function leave(appId){
	if (socket){
		socket.emit("leave", appId);
	}
};

