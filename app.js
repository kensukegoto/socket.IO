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