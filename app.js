const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// const nsp = io.of("/my-namespace");
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,"public")));

http.listen(port,()=>{
  console.log(`Server listening at port %d`,port);
});

let chatRooms = {
  n1 : "始まりの部屋",
  n2 : "次の部屋",
  n3 : "そのまた次の部屋"
};

let userCount = 0;

io.on("connection",socket => {

  userCount++;

  let defaultRoom = null;
  let currentRoom = null;

  // join roomを受信
  socket.on("join room",data => {

    // デフォルトを保存
    if(!defaultRoom) defaultRoom = Object.keys(socket.rooms)[0];
    if(currentRoom === data.room) return;
    
    currentRoom = data.room;
    socket.join(currentRoom);
    io.to(currentRoom).emit("join",`ユーザーナンバー${userCount}`);
    
  })
})