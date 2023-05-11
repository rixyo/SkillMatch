import Image from 'next/image';
import React,{useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { AiOutlineCloudUpload } from 'react-icons/ai';
type ImageUploadProps = {
    onChange:(base64:string)=>void;
    value?:string;
    label:string;
    disabled?:boolean;


    
};

const ImageUpload:React.FC<ImageUploadProps> = ({onChange,value,label,disabled}) => {
    const [base64,setBase64]=useState<string>(value || "")

    const handleChange=useCallback((base64:string)=>{
        onChange(base64)

    },[onChange])
    const onDrop=useCallback((acceptedFiles:any)=>{
        const reader=new FileReader();
        reader.readAsDataURL(acceptedFiles[0])
        reader.onload=(event:any)=>{
           setBase64(event.target.result)
              handleChange(event.target.result)
        }
        reader.readAsDataURL(acceptedFiles[0])
    },[handleChange])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles:1,
        onDrop,
       disabled,
       accept:{
              image: ['image/jpeg', 'image/png', 'image/jpg'],

       },
       maxSize: 1048576,


    })
    
    return(
        <div
        {...getRootProps({
            className:"w-full p-4 text-black text-center bg-neatural-500 border-2 border-dotted rounded-md flex flex-col items-center justify-center cursor-pointer"
        })}
        >
            <input {...getInputProps()} />
            {
                base64 ? (
                    <div className='flex items-center justify-center'>
                        <Image
                        src={base64}
                        width={100}
                        height={100}
                        alt="cover"
                        className='rounded-md object-cover'
                        />
                    </div>

                ):(<div className='flex items-center'>
                    <AiOutlineCloudUpload className='text-xl'/>
                    <p className='ml-2'>{label}</p>
                </div>)
            }

        </div>
    )
}
export default ImageUpload;