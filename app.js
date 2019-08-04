const io_pub = require('socket.io')(8023);
const io_sub = require('socket.io')(8024);


/*
 * サーバの接続
 */
io_pub.on('connection', function ( socket ) {

  socket.on("message",msg => {

      io_sub.sockets.emit("message",msg);
 
  })
  
});