import { asynchandler } from "../utils/asynchandler.js";
import {API_ERROR} from "../utils/ApiError.js"
import { User } from "../Models/User.Model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { genertetoken } from "../utils/generatetoken..js";


const generateAccessTokenAndRefreshToken=async(userId)=>{
    try {
 
         const user=await User.findById(userId)
        
         
         const accessToken=user.generateAccessToken()
         const refreshToken=user.generateRefreshToken()
         
         //user.refreshToken=refreshToken
       await   user.save({validateBeforeSave: false})
 
         return {accessToken,refreshToken}
     
    } catch (error) {
 
     throw new API_ERROR(500,"Something went wrong while registering the user",error)
     
    }
 
 
 
 
 }

const registerUser=asynchandler(async (req,res)=>{
   
    const {name,email,password}=req.body
    

    if([name,email,password].some((field)=>field?.trim()===""
    )){
        throw new API_ERROR(400,"field are empty")
    }

     const existedUser=await User.findOne({email})

     if(existedUser){
        throw new API_ERROR(500,"User already exits")
     }


     const user=await User.create({
        name,
        email,
        password,
        
        
    
     })

     


     if(!user){
      throw new API_ERROR(500,"user creation failed")
     }  

     

     res.status(201).json(new ApiResponse(200,"user created sucessfully",user))
    

  
})

const loginUser=asynchandler(async(req,res)=>{
    const {email,password}=req.body

  
     

    if(!email && !password ){
        throw new API_ERROR(401,"Please enter username and password")
    }

    const user=await User.findOne({email})

    if(!user){
        throw new API_ERROR(401,"User not Found")
    }

   const isPasswordValid= await user.isPasswordCorrect(password)
     
   if(!isPasswordValid){
    throw new API_ERROR(401,"Invalid user credentials")
   }
    
   const {accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id)
 
   const loggedInUser=await User.findById(user._id).select("-password")

   const options={
    httpOnly:true,
    secure:true
    
   }
  
   res.status(201)
   .cookie("accessToken" ,accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(new ApiResponse(
     200,
     
    
     "User loggedIn sucessfully",
     {
        user:  accessToken,refreshToken,loggedInUser
     },
    
    
   ))
   



   
  

   
})

const logoutUser=asynchandler(async(req,res)=>{
    const user= await User.findById(req.user?._id)

 const options={
    httpOnly:true,
    secure:true
 }

 res.status(201)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(new ApiResponse(
    200,
    "User Logged Out successfull",
    {}
 ))

})

const getallUser=asynchandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name : {$regex:req.query.search,$options:"i"}},
            {email : {$regex:req.query.search,$options:"i"}}
        ],
    }:{};
   
  const user= await User.find({_id:{$ne:req.user._id}}).find(keyword)
  res.send(user)
    
})
export {
    registerUser,
    loginUser,
    logoutUser,
    getallUser
}