const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

server.listen(port,()=>{
  console.log(`Server listening at port %d`,port)
});

app.use(express.static(path.join(__dirname,"public")));

let numUsers = 0;

io.on("connect",socket => {

  let addedUser = false;

  socket.on("add user",username => {
    
    if(addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login",{
      numUsers: numUsers
    });

    socket.broadcast.emit("user joined",{
      username: socket.username,
      numUsers: numUsers
    });
  });

  // userがタイプをしているならば
  socket.on("typing",() => {
    socket.broadcast.emit("typing",{
      username: socket.username
    });
  });

  // userがタイプを止めたならば
  socket.on("stop typing",()=>{
    socket.broadcast.emit("stop typing",{
      username: socket.username
    });
  });

  // userがメッセージを送ったならば
  socket.on("new message",data => {
    socket.broadcast.emit("new message",{
      username: socket.username,
      message: data
    });
  });

  // userの接続が切れたならば
  socket.on("disconnect",() => {
    if(addedUser){
      --numUsers;
    }
    socket.broadcast.emit("user left",{
      username: socket.username,
      numUsers: numUsers
    });
  });


});