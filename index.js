const express=require('express');
const http=require('http');
const PORT=process.env.PORT||8000;
const cors=require("cors");



const app=express();


const server=http.createServer(app);


// Set Up socket.io
const io=require('socket.io')(server,{
    cors:{
        // Allow requests from all origins
        origin:"*",
        methods:['GET','POST']

    }
});

app.use(cors());

// SO what happens when a client connects to a server

// when a client makes a connection thorugh a socket all its data will be in socket

io.on('connection',(socket)=>{
    // now socket is making request
   
    // This is the ID thorugh which other users will call me and it will change everytime
    socket.emit("me",socket.id);

    socket.on('disconnect',()=>{
        socket.broadcast.emit("callended");
    });
      
    // When  user presses call it will eitnevent to the user with entered id (LoL you can call yourselves too)
    socket.on("calluser",({userTocall,signalData,from,name})=>{


        io.to(userTocall).emit("calluser",{signal:signalData,from , name});
    });

    socket.on("answercall",(data)=>{

        io.to(data.to).emit('callaccepted',data.signal);
    });



});


app.get('/',(req,res)=>{
    res.send("Hi! This is Home route");
});


server.listen(PORT,()=>{
    console.log("Server is Up and Running");
});

