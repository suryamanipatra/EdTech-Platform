const jwt = require("jsonwebtoken");
require("dotenv")
const user = require("../model/User")

//auth

exports.auth  = async(req,res,next) => {
    try {
        // extract tooken
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "");

        // if token missing then return response
        if(!token){
            return res.status(4011).json({
                success:false,
                message:"Token is missing !!!"
            })
        }
        // verify the token
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(error);
            req.user = decode;
        } catch (error) {
            // verification -> issue

            return res.status(401).json({
                success:false,
                message:"Token is Invalid !!!"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token..."

        })
    }
}

//isStudent


exports.isStudent = async(req,res) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student Only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again !!!"
        })
    }
    
}
//isInstructor

exports.isInstructor = async(req,res) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor Only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again !!!"
        })
    }
    
}

//isAdmin

exports.isAdmin = async(req,res) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin Only"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role can not be verified, please try again !!!"
        })
    }
    
}