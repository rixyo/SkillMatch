import useCurrentUser from '@/hooks/useCurrentUser';
import useEditModal from '@/hooks/useEditModal';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import React,{useState,useEffect, useCallback} from 'react';
import {toast} from "react-hot-toast"
import ImageUpload from '../ImageUpload';
import Input from '../Input';
import Modal from './Modal';


const EditModal:React.FC= () => {
    const {data:currentUser} = useCurrentUser()
    const editModal=useEditModal()
    const {mutate:editUser} = useUser(currentUser?.user?.id)
    const [name,setName]=useState<string>("")
    const [bio,setBio]=useState<string>("")
    const [profileImage,setProfileImage]=useState<string>("")
    const [coverImage,setCoverImage]=useState<string>("")
    
    useEffect(()=>{
        setProfileImage(currentUser?.user?.profileImage)
        setCoverImage(currentUser?.user?.coverImage)
        setName(currentUser?.user?.name)
        setBio(currentUser?.user?.bio)

    },[currentUser?.user?.name,currentUser?.user?.bio,currentUser?.user?.profileImage,currentUser?.user?.coverImage])
    const [isLoading,setIsLoading]=useState<boolean>(false)
   const onSubmit=useCallback(async()=>{
    try {
        setIsLoading(true)
        await axios.patch(`/api/edit`,{name,bio,profileImage,coverImage})
        editUser()
        toast.success("Profile updated successfully")
        editModal.onClose()
        
    } catch (error: any) {
        toast.error(error.response?.data?.error || error.message)
        
    } finally {
        setIsLoading(false)
    }
    
   },[name,bio,profileImage,coverImage,editUser,editModal.onClose])

   const bodyContent=(
    <div className='flex flex-col gap-4'>
           <ImageUpload
         value={coverImage}
            onChange={(image)=>setCoverImage(image)}
            label="Upload cover Image"
            disabled={isLoading}

       />
       <ImageUpload
         value={profileImage}
            onChange={(image)=>setProfileImage(image)}
            label="Upload Profile Image"
            disabled={isLoading}

       />
        <Input
        onChange={(e)=>setName(e.target.value)}
        value={name}
        placeholder="Name"
        type="text"
        disabled={isLoading}

        />
        <Input
        onChange={(e)=>setBio(e.target.value)}
        value={bio}
        placeholder="Bio"
        type="text"
        disabled={isLoading}
        />


    </div>
   )
    
    return (
        <Modal onClose={editModal.onClose} onSubmit={onSubmit} actionLabel="Edit" isOpen={editModal.isOpen} title='Edit Profile' 
      body={bodyContent}

        />
    )
}
export default EditModal;