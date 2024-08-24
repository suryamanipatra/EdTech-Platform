const Section = require("../model/Section")
const SubSection = require("../model/SubSection")
const Course = require("../model/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


//create SubSection
exports.createSubSection = async (re,res) => {
    try {
         //fetch data from req ki body
         const {sectionId, title,timeDuration,description} = req.body;
          // ectract file/video
          const video = req.files.videoFile;
         // validation
         if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                messgae:"All fields are required !!!"
            })
         }

         // upload vidoe to cloudinary

         const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
         // create a subsection
         const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
         })
         // update section with this subSection ObjectId
         const updatedSection = Section.findByIdAndUpdate({_id:sectionId},
                                                        {
                                                            $push:{
                                                                subSection:SubSectionDetails._id,
                                                            }
                                                        },
                                                        {new:true})
        // log updatedSection here,after adding populate query
         // return res
         return res.status(200).json({
            success:true,
            message:"SubSection created Successfull ...",
            updatedSection
         })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create SubSection, please try again !!!",
            error:error.message
        })
    }
}

// updateSubSection

// deleteSubSection