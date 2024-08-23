const User = require("../model/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")


//reset password token
exports.resetPasswordToken = async(req,res) => {
    try {
           // get email from req ki body
        const email = req.body.email;
        // check user for this email, email validation
        const user = await User.findOne({email:email});
        if (!user){
            return res.json({
                sucess:false,
                message:"Your email is not registered, please registered !!!"
            });
        }
        //  generate token
        const token = crypto.randomUUID();
        // update user by adding token and expiration time
        const updatedDetails = await User.findByIdAndUpdate({email:email},
                                                            {token:token,
                                                            resetPasswordExpires:Date.now() + 5*60*1000
                                                            },
                                                            {new:true}) 
        // create url
        const url = `http://localhost:3000/update-password/${token}`
        // send mail containing the url
        await mailSender(email,
                        "Password Reset Link",
                        `Passwrd reset link : ${url}`);
        // return response
        return res.json({
            sucess:true,
            message:'Email sent Successfully, please check your email and change password'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending the reset password email ... "
        })
    }

    
}

// reset password   
exports.resetPassword = async(req,res) => {
    try {
        // data fetch
        const {password,confirmPassword,token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }
        // get userdetails from db using token
        const userDetails = await user.findOne({token:token});
        // if no entry -> invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is expired ..."
            })
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired, please regenerate token ..."
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10)
        // password upadte
        await User.findByIdAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset Successfully ..."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Token is expired, please regenerate token ..."
        })

        
    }
}