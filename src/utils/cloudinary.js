import {v2 as cloudinary, v2} from "cloudinary"

import fs from "fs"
import { API_ERROR } from "./ApiError.js";


    // Configuration

    const uploadOnCloudinary=async(localfilepath)=>{
        cloudinary.config({ 
            cloud_name: 'dlwmylfh0', 
            api_key: '622873594415476', 
            api_secret: 'GJ9XkVC6oLWfTRg9xozTRs45DfM' // Click 'View API Keys' above to copy your API secret
        });
    
      

            const uploadResult = await cloudinary.uploader
            .upload(
                'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                    public_id: 'shoes',
                }
            )
            .catch((error) => {
                console.log(error);
            });
         
       

    }







export {uploadOnCloudinary}