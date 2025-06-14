import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary= async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        console.log("File has been uploaded successfully",response.url);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        return null;
        fs.unlinkSync(localFilePath)  //this code will remove the locally saved file to clear storage of failed file!!
    }
};

export {uploadOnCloudinary}