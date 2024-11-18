import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/dbconnect.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import {Server} from "socket.io"
import path from "path"

dotenv.config();
const app = express();


connectDB()
var corsOptions = {
  origin: "*",
   methods:[ 'GET, POST, PUT, DELETE, OPTIONS'],
   credentials:true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import  user routes
import UserRouter from "./src/routes/User.routes.js"

app.use("/users",UserRouter)
//chats routes
import ChatRouter from "./src/routes/Chat.routes.js"
app.use("/chats",ChatRouter)

//message routes
import MessageRouter from "./src/routes/Message.routes.js"
app.use("/message",MessageRouter)





// -----------Deployment Code----------------

const _dirname1=path.resolve();
if(process.env.NODE_ENV==="development"){
  
  app.use(express.static(path.join(_dirname1,"Frontend/Talk-a-tive/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname1,"Frontend","Talk-a-tive","dist","index.html"))
  })

}else{

app.get("/", (req, res) => {
  res.send("server is ready");
});

}


// -----------Deployment Code----------------












app.get("/", (req, res) => {
  res.send("server is ready");
});

app.get("/api/data", (req, res) => {
  res.send(chats);
});

app.get("/api/data/:id", (req, res) => {
  const singlechat = chats.find((e) => e._id == req.params.id);
  res.send(singlechat);
});

const PORT = process.env.PORT || 3000;

const server=app.listen(PORT, () => {
  console.log("Server is listning on port : http://localhost:3000");
});

const io=new Server(server,{
   pingTimeout:60000,
   cors:{
    origin:"http://localhost:5173"
   }
})

io.on("connection",(socket)=>{
    
  
  socket.on("setup",(userData)=>{
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join chat",(room)=>{
    socket.join(room)
   
       
  })
  socket.on("typing",(room)=>{
    socket.in(room).emit("typing")
  })

  socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing")
  })

  socket.on("new message",(newMessageRecieved)=>{
   
    
    var chat=newMessageRecieved.chat
    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user => {
      if(user._id==newMessageRecieved.sender._id) return;
       
       socket.in(user._id).emit("message recieved",newMessageRecieved)
       
       
      
    });
    

  })

  socket.off("setup",()=>{
     console.log("user Disconnected");
     socket.leave(userData._id)
     
  })
  
   
})


