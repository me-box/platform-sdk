import socket from 'socket.io';

let ns;

export default function init(server, store, secret){

    const io = socket.listen(server);

    ns = io.of('/databox');

    ns.on('connection', function(socket){

      socket.on('join', function(app){
        console.log("joining client to room ", app);
        socket.join(app);
      });

      socket.on('leave', function(app){
        console.log("leaving room: " + app);
        socket.leave(app);
      });
      
      socket.on('disconnect', function(){
          console.log("socket disconnect!");
      });
    });
}

export function sendmessage(room, event, message){
    ns.to(room).emit(event, message); 
};
