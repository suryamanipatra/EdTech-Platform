const Profile = require("../model/Profile")
const User = require("../model/User")

exports.updateProfile = async (req,res) => {
    try {
        // get Data
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;
        // get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required !!!"
            })
        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId  = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        // return res
        return res.status(200).json({
            success:true,
            message:"Profile updated Successfully ..."
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Profile, please try again !!!",
            error:error.message
        })
    }
}


// delete Account
// Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req,res) => {
    try {
        // get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found !!!"
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
                // TODO:HW -> unenroll user from enrolled courses
        // delete user
        await User.findByIdAndDelete({_id:id});
        // return res
        return res.status(200).json({
            success:true,
            message:"Profile Delete Successfully ...",
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User can not be deleted, please try again !!!",
            error:error.message
        })
    }
}


exports.getAllUserDetails = async (req,res) => {
    try {
        // get id
        const id = req.user.id;
        // validation and get user deatils
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return res
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully ...",
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to fetch User data, please try again !!!",
            error:error.message
        })
    }
}