import io from 'socket.io-client';
import {newMessage} from '../actions/AppActions';
let socket;

export function init(namespace, appId, dispatch) {
  console.log("initing websokcet!"); 
  socket = io('/'+namespace, {path: '/app/socket.io'});
 
  socket.on("connect", function(){
  	  console.log("joining on : " + appId);
      socket.emit("join", appId);
  });

  socket.on("message", function(data){
    dispatch(newMessage(data));
  });

};

export function leave(appId){
	if (socket){
		socket.emit("leave", appId);
	}
};

