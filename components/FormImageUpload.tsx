import React,{useCallback} from 'react';
import {CldUploadWidget,CldImage} from "next-cloudinary"
import Image from 'next/image';
import {TbPhotoPlus}from "react-icons/tb"

declare global {
    var cloudinary: any;
}
type FormImageUploadProps = {
    value:string;
    onChange:(value:string)=>void;

    
};
const FormImageUpload:React.FC<FormImageUploadProps> = ({onChange,value}) => {
    const uploadPreset = "tw9uaoam"
    const handleUplaoad=useCallback((result:any)=>{
        onChange(result.info.secure_url)

    },[onChange])
    console.log(value)
    return (
        <CldUploadWidget 
      onUpload={handleUplaoad} 
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-
              mt-2
            "
          >
            <TbPhotoPlus
              size={50}
            />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value && (
              <div className="
              absolute inset-0 w-full h-full">
                <CldImage
                  fill 
                  style={{ objectFit: 'cover' }} 
                  src={value}
                  alt="post image" 
                  
                />
              </div>
            )}
          </div>
        ) 
    }}
    </CldUploadWidget>
  )
}
    
export default FormImageUpload;