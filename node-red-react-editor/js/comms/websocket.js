import io from 'socket.io-client';
import {debugMessage} from '../actions/AppActions';
let socket;

//appId is used to create the websocket room
export function init(namespace, appId, dispatch) {
  console.log("initing websokcet!"); 
  socket = io('/'+namespace, {path: '/app/socket.io'});
  
  socket.on("connect", function(){
  	  console.log("joining on : tlodge ");
      socket.emit("join", "tlodge");
  });

  socket.on("message", function(data){
    console.log("SEEN A MESSAGE!!!");
    //dispatch(debugMessage(data));
  });

};

export function leave(appId){
	if (socket){
		socket.emit("leave", appId);
	}
};

