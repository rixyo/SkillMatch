import useCurrentUser from '@/hooks/useCurrentUser';
import useGetSkill from '@/hooks/useGetSkill';

import useSkillModal from '@/hooks/useSkillModal';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';



const SkillModal:React.FC = () => {
    const skillModal=useSkillModal()
    const router=useRouter()
    const {userId}=router.query
    const [name,setName]=useState<string>('')
    const [error,setError]=useState<string>('')
    const {data:currentUser}=useCurrentUser()
    const {mutate:mutatedSkill}=useGetSkill(userId as string)
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.value.length>100) return
        setName(e.target.value)
    }
    const onSubmit=useCallback(async()=>{
        if(!currentUser)
            return
         else if(name.length<=0){
            setError('Skill is a required field')
            return


         }   
          else{
             axios.post('/api/users/skill',{name})
                    skillModal.onClose()
                    setName('')
                    mutatedSkill()
                    toast.success('Skill added')

             
          }  
    },[name,currentUser])
    
    const bodyContent=(
        <div className='flex flex-col gap-3'>
            

            <h1 className='text-md text-gray-500'>Skill*</h1>
            <input type="text" value={name} onChange={handleChange} className='border-2 border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Skill'/>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
           <div className='mt-10'>
            <h1 className='text-md text-black font-bold'>Suggested based on your profile</h1>
            <div className='flex flex-wrap gap-2 mt-2 cursor-pointer'>
                <div className='bg-gray-200 rounded-lg p-2'>HTML</div>
                <div className='bg-gray-200 rounded-lg p-2'>CSS</div>
                <div className='bg-gray-200 rounded-lg p-2'>Javascript</div>
                <div className='bg-gray-200 rounded-lg p-2'>React</div>
            </div>
           </div>
        </div>
    )
    
    return (
        <Modal isOpen={skillModal.isOpen} onClose={skillModal.onClose} title='Add Skill'
        onSubmit={onSubmit } actionLabel={'Save'} body={bodyContent}       />
    )
}
export default SkillModal;