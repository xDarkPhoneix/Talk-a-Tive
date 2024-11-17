import { Chats } from "../Models/Chat.Model.js";
import { Message } from "../Models/Message.Model.js";
import { User } from "../Models/User.Model.js";
import { API_ERROR } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const sendMessage=asynchandler(async(req,res)=>{
      
    const {content,chatId}=req.body

    if(!content || !chatId){
        throw new API_ERROR(400,"chaId or content missing")
    }

    var newmessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
  
    var message=await Message.create(newmessage)
    message=await message.populate("sender","name email")
     message=await message.populate("chat") 
     message=await User.populate(message,{
        path:"chat.users",
        select:"name pic email"
     })
    
    
      
    if(!message){
        throw new API_ERROR(500,"message was not created")
    }

    
    await Chats.findByIdAndUpdate( req.body.chatId,
        {
            latestMessage:message
        },
        {
            new :true
        }
    )


    res.status(201).json(new ApiResponse(200,"Message send successfully",message))




})

const getAllMessage=asynchandler(async(req,res)=>{
try {

    const msg=await Message.find({
        chat:req.params.chatId
    }).populate("sender","name pic email")
    .populate("chat")


    res.status(201).json(new ApiResponse(200,
        "Message fetched successfull",
        msg
    ))
    
} catch (error) {
    throw new API_ERROR(400,"Something went wrong while fetching chats")
}
 

})

export {
    sendMessage,
    getAllMessage
}