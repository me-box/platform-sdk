import socket from 'socket.io';

let ns;

export default function init(server, store, secret) {
  console.log("initing socket io");
  const io = socket.listen(server);

  ns = io.of('/databox');

  ns.on('connection', function (socket) {

    socket.on('join', function (app) {
      console.log("joining client to room ", app);
      socket.join(app);
    });

    socket.on('leave', function (app) {
      console.log("leaving room: " + app);
      socket.leave(app);
    });

    socket.on('disconnect', function () {
      console.log("socket disconnect!");
    });
  });
  console.log("finished initing socket io");
}

export function sendmessage(room, event, message) {
  ns.to(room).emit(event, message);
};
