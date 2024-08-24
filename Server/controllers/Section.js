const Section = require("../model/Section")
const Course = require("../model/Course")


exports.createSection = async (req,res) => {
    try {
        // data fetch req ki body
        const {sectionName,courseId} = req.body;
        // validation
        if(!sectionName || !courseId){
            return res.statu(400).json({
                success:false,
                message:"Missing Properties !!!"
            })
        }
        // create section
        const newSection = Section.create({sectionName})
        // update Course with Section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true},
                                            );
                                            // HW : use populate to replace sections/sub-section both in the updatedCoureseDetails
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully ...",
            updatedCourseDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable create Section, please try again !!!",
            error:error.message
        })
    }
}


exports.updatedSection = async (req,res) => {
    try {
        // data input
        const {sectionName,sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.statu(400).json({
                success:false,
                message:"Missing Properties !!!"
            })
        }
        // update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully ...",
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again !!!",
            error:error.message
        })
    }
}


exports.deleteSection = async (req,res) => {
    try {
        // get Id - assuming that we are sending Id in param
        const {sectionId} = req.params
        // use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        // TODO[built in testing] : Do we need the entry from course Schema ??
        // return res
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully ...",
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again !!!",
            error:error.message
        })
    }
}