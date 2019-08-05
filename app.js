const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const nsp = io.of("/my-namespace");
const nsp2 = io.of("/my-namespace2");

app.get("/",(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});
app.get("/2",(req,res)=>{
  res.sendFile(__dirname + '/index2.html');
});
app.get("/socket.io.js",(req,res)=>{
  res.sendFile(__dirname + '/socket.io.js');
});

let numUsers = 0;

nsp.on("connection",socket => {
  numUsers++;
  if(numUsers%2!==0){
    socket.join("some room");
  }
  
  nsp.emit("hi","everyone");
  nsp.to("some room").emit("hi","everyone in some room");
});


http.listen(3000,()=>{
  console.log("listening on *:3000");
});