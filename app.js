const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/",(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get("/socket.io.js",(req,res)=>{
  res.sendFile(__dirname + '/socket.io.js');
});

let users = {};

io.on("connection",socket => {

  if(!users[socket.id]){
    users[socket.id] = "名無し"
  }
  socket.on("chat message",msgObj => {
    const {m,user} = msgObj;
    if(user) users[socket.id] = user;
    io.emit("chat message",{user: users[socket.id],message: m});
  });

});

http.listen(3000,()=>{
  console.log("listening on *:3000");
});