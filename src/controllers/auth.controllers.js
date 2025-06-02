import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccesToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

 
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async function (req,res){
    //steps followed to register user
    //1.Taking data from user
    //2.validation
    //3.check if already registered
    //4.check for the images and avatar
    //5.upload those images on cloudinary
    //6.create user object and entry in DB
    //7.remove password and refresh token from the response(DB->USER)
    //8.check for user creation
    //9.send response to user
    
    const {fullName , email , password } = req.body;
    console.log("Email:",email);
    
    if(
        [fullName , email , password].some((field)=>
            field?.trim() === "")
    ){
        throw new ApiError(400,"All the fields are important");
        
    }
    const existingUser = await User.findOne({
        $or: [{fullName},{email}]
    });
    if(existingUser){
        throw new ApiError(409,"User already exists");
    }
   
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required to uploaded")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar)

    if(!avatar){
        throw new ApiError(400,"avatar is not uploaded")
    }
    const user = await User.create({
       fullName, 
        email ,
        password ,
        avatar:avatar.url ,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )   
})

const loginUser = asyncHandler(async function (req,res) {
    //Steps to login a user
    //0.check for the access tokens in the browser if available validate and directly login the user
    //1.request data from body
    //2.validate the data
    //3.if matched login else give error

    const {email,password} = req.body;

    if(!email){
        throw new ApiError(400," email is required")
    }
    if(!password){
        throw new ApiError(400,"password is required")
        }
    const user = await User.findOne({
        email
    })
    if(!user){
        throw new ApiError(401,"User does not exits")
    }

     const isPasswordValid = await user.isPasswordCorrect(password)
     if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
     }
     const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})
    const logoutUser = asyncHandler(async (req,res) => {
        //Steps to logout a user
        await User.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    refreshToken: undefined
                },
            },
            {
                new: true
            }
        )
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User Logged Out"))
    })
    const refreshAccessToken = asyncHandler(async (req,res) =>{
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
            throw new ApiError(401,"Unauthorized request");
        }
        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
            const user = await User.findById(decodedToken?._id);
            if(!user){
                throw new ApiError(401,"Invalid refresh token");
            }
            if(incomingRefreshToken !== user?.refreshToken){
                throw new ApiError(401,"Refresh Token is expired or used");
            }
            const options = {
                httpOnly: true,
                secure:true
            }
            const {accessToken,newrefreshToken} = await generateAccessAndRefereshTokens(user._id)
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
        } catch (error) {
            throw new ApiError(401,"Unauthorized request");
        }
    })

    const changeCurrentPassword = asyncHandler(async(req,res)=>{
        const {oldPassword,NewPassword} = req.body;
        const user = User.findById(req.user?._id)
        const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
        if(!isPasswordCorrect){
            throw new ApiError(401,"Old password is incorrect");
        }
        user.password = NewPassword
        await user.save({validateBeforeSave: false})
        return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
    })

    const getCurrentUser = asyncHandler(async(req,res)=>{
        res
        .status(200)
        .json(200,req.user,"Current User Fetched successfully")
    })
    const updatAccountDetails = asyncHandler(async(req,res) =>{
        const {fullName,email} = req.body;
        if(!(fullName && email)){
            throw new ApiError(400,"Please fill all the fields");
        }

        const user = User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    fullName:fullName,
                    email:email
                }
            },
            {new:true}
        ).select("-password")
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Account details updated successfully"))
    })
    const updateAvatar = asyncHandler(async (req,res)=>{
        const avatarLocalPath = req.file?.path;
        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar File is missing");
        }

        const avatar =  await uploadOnCloudinary(avatarLocalPath)

        const user = User.findByIdAndUpdate(avatar,
            {
                $set:{
                    avatar:avatar.url
                }
            },
            {new:true}
        ).select("-password")
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Avatar updated successfully"))

    })

export {registerUser, 
    loginUser, 
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updatAccountDetails,
    updateAvatar,
 }