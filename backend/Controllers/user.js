const { findOne } = require("../models/User");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Post = require("../models/Post");


exports.register = async (req, res) =>{
    try {

       const {name, email, password} = req.body;
       
       let user = await User.findOne({email});

       if(user)
       {
        return res.status(400).json({
            success:false,
            message:"User already exists"
          });
       }

     user = await User.create({name, email, password, avatar:{public_id : "sample_id", url : "sample_url"}, });
        
    const token = await user.generateToken();

    const options = {
        expires : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
        httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
        success:true,
        user,
    })
       
    } catch (error) {

        res.status(500).json({
            success:false,
            message: error.message   ,
        });
    }
} 

exports.login = async (req, res) =>{
  
    try {
    const {email, name, password} = req.body;
    const user = await User.findOne({email}).select("+password");

    if(!user)
    {
        return res.status(500).json({
            success:false,
            message: "User does not exists",
        })
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch)
    {
        return res.status(400).json({
            success:false,
            message:"Incorrect Password",
        })
    }

    const token = await user.generateToken();

    const options = {
        expires : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
        httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
        success:true,
        user,
    })
   


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
     
 }

 exports.logout = async function (req, res) {


    try {

         const options = {
        expires : new Date(Date.now()), 
        httpOnly: true,
         };
       
        res.status(200).cookie("token", null, options).json({
            success:true,
            message: "logout successfully",
        })


        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
     
 }


 exports.followUsers = async function(req, res) {
    try {
     
     
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        
        if(!userToFollow) 
        {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            })
        }


        if(loggedInUser.following.includes(userToFollow.id))
        {
         
            const indexfollower = await loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexfollower, 1);

            const indexfollowing = await userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexfollowing, 1);

            await loggedInUser.save();
            await userToFollow.save();
    
            return res.status(201).json({
                success: true,
                message: "User unfollowed",
            })

        }

        

        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(201).json({
            success:true,
            message:"user followed" 
        })

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
        
    }
 }


 exports.myProfile = async function(req, res) {


    try {

     const user = await  User.findById(req.user._id).populate("posts");


     res.status(201).json({
        success:true,
        user,
        
    })

        
    } catch (error) {

         return res.status(500).json({
            success:false,
            message: error.message,
        })
        
        
    }

   
 }


 exports.updatePassword = async function(req, res) {

    try {

        const user = await User.findById(req.body._id).select("+password");

        const {oldPassword, newPassword} = req.body;


        if(!oldPassword || !newPassword)
        {
            return res.status(500).json({
                success:false,
                message:"Please enter both the passwords",
            })
        }

       const isMatch = user.matchPassword(oldPassword);

       if(!isMatch)
       {
         return res.status(404).json({
            success:false,
            message: "wrong password",
        })
       }

       user.password = newPassword;

       await user.save();

       res.status(201).json({
        success:"true",
        message:"Password Updated",
       })

    

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        
        })
 }
}


exports.updateProfile = async function(req, res){

    try {

        const user = await User.findById(req.body);
        const {name, email} = req.body;

        if(name)
        {
            user.name = name;
        }
        if(email)
        {
            user.email = email; 
        }

        res.status(200).json({
            success:true,
            message: "Profile Updated",
        })
        
    } catch (error) {
          return res.status(500).json({
            success:false,
            message: error.message,
        
        })
    }
}


exports.getProfile = async function(req, res) {


    try {

     const user = await  User.findById(req.params.id).populate("posts");

     if(!user)
     {
        return res.status(404).json({
            success:false,
            message : "User not Found",
        })
     }


     res.status(201).json({
        success:true,
        user,
        
    })

        
    } catch (error) {

         return res.status(500).json({
            success:false,
            message: error.message,
        })
        
        
    }

   
 }
