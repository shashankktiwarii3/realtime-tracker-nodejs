const express = require('express');
const app = express();
const http = require("http");
const path = require('path'); 

const socket = require("socket.io")

const server = http.createServer(app)

const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    console.log(`New connection: ${socket.id}`);

    socket.on("locationSend", (data)=>{
        io.emit("receiveLocation", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("userDisconnected", socket.id);
    });
});
app.get("/", (req,res)=>{
    res.render("index");
})

server.listen(3000);