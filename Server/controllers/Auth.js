const User = require("../model/User")
const OTP = require("../model/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv")



//sendOTP
exports.sendOTP = async(req,res) => {

    try {
            // Fetch email from req body
        const {email} = req.body;

        //  Check if user already exist
        const checkUserPresent = await User.findOne({email});

        // If User exist, then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message:"User already registered..."
            })
        }
        // Generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("OTP Generated : ",otp);

        // check unique OTP or not
        let result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email, otp};

        // Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response successfully

        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully...",
            otp
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }


}


//signUp

exports.signUp = async(req,res) => {
    try {
        // data fetch from req ki body
        const {firstName, lastname,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;
        // validate karo data
        if(!firstName || !lastname || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required !!"
            })
        }
        // 2 password match karo
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword value does not match, please try again"
            })
        }
        // check user already exist or not

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered..."
            })
        }
        // find most recent otp Stored for User
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp) 
        // validate otp
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:true,
                message:"OTP not found !!!"
            })
        } else if(otp != recentOtp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP !!!"
            })
        }
        // hashed the password
        const hashedPassword = await bcrypt.hash(password,10);

        // entry create in DB

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastname}`

        })

        // retrun response
        return res.status(200).json({
            success:true,
            message:"User is registered Successfully...",
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cann't be registered. Please try again"
        })
    }
}

//Login



exports.login = async (req,res) =>{
    try {
        // get data from req ki body

        const {email,password} = req.body;
        // validation karo data ki
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required !!!"
            })
        }
        // check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:flase,
                message:"user is not registered, please signup first..."
            });
        }
        // generate JWT,after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,

            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });
            user.token = token;
            user.password = undefined;
            // create cokkie and send response
            const options = {
                expires:new Date(Date.now() + 3*34*60*60*1000),
                httpOnly : true
            }
    
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully..."
            })
    
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect !!!"
            })
        }
        

       
        


    } catch (error) {
        console.log(error);
        return res.json(500).json({
            success:false,
            messgae:"Login Failure, Pelase try again..."
        })
    }
};

//changePassword

exports.changePassword = async (req,res) => {
    // get data from req ki body
    // get oldPassword,newPassword,confirmpassword
    //validation

    //update Password in DB
    // send mail -> password change
    // return response
}