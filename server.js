const http=require('http')
const express=require('express');
const exp = require('constants');
const { Socket } = require('dgram');
const app=express()
const server=http.createServer(app)
const port =process.env.PORT || 3000;
app.use(express.static(__dirname+"/public"))
app.get('/',(req,resp)=>{
    resp.sendFile(__dirname+"/index.html")
})


// Socket.io setup 
const io=require('socket.io')(server)
var user={};

io.on('connection',(Socket)=>{
    Socket.on("new-user-joind",(username)=>{
        user[Socket.id]=username;
        Socket.broadcast.emit('user_connected',username);
        io.emit("user-list",user)
        
    })
     Socket.on("disconnect",()=>{
         Socket.broadcast.emit('user-disconnected',usre=user[Socket.id]);
        delete user[Socket.id];
        io.emit("user-list",user);
    });
    Socket.on('message',(data=>{
        Socket.broadcast.emit("message",{user:data.user,msg:data.msg})
    }))
})




server.listen(port,()=>{
    console.log("server start at"+port)
})