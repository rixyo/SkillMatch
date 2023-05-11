// Date: 08-05-2023 11.35 PM
import useGetProjects from '@/hooks/useGetProjects';
import useGetSkill from '@/hooks/useGetSkill';
import usePosts from '@/hooks/usePosts';

import useSkillModal from '@/hooks/useSkillModal';
import useUsers from '@/hooks/useUsers';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';



const SkillModal:React.FC = () => {
    const skillModal=useSkillModal()
    const router=useRouter()
    const {userId}=router.query
    const [name,setName]=useState<string>(" ")
    const [error,setError]=useState<string>('')
  
    const {mutate:mutatedUser}=useUsers()
    const {mutate:mutatedPost}=usePosts()
   

    const {mutate:mutatedSkill}=useGetSkill(userId as string)
    const programmingLanguages = [
        "JavaScript",
        "Java",
        "Python",
        "Mogo",
        "C#",
        "PHP",
        "C++",
        "Ruby",
        "Swift",
        "Objective-C",
        "Kotlin",
        "TypeScript",
        "Scala",
        "Go",
        "Rust",
        "Dart",
        "Lua",
        "Perl",
        "Haskell",
        "Clojure",
        "Erlang",
        "F#",
        "Visual Basic",
        "Assembly",
        "SQL",
        "HTML",
        "CSS"
      ];
    
    
      
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      
        if(e.target.value.length>100) return
        setName(e.target.value)
     
       
      
    }
 
  
    const onSubmit=useCallback(async()=>{
  
     
      
          if(name.length===0){
            setError('Please fill all the fields')
            return


         }   
          else{
          
            try {
               await axios.post('/api/users/skill',{name})
               setName('')
              
               setError('')
               mutatedSkill()
               mutatedUser()
                mutatedPost()
               skillModal.onClose()
                toast.success('Skill added')
                
            } catch (error:any) {
            
                setError(error?.response?.data)
              
                
            }
             

             
          }  
    },[name])
    const handleClick=(language:string)=>{
        setName(language)
    }
  
    
    const bodyContent=(
        <div className='flex flex-col gap-3'>
            
          
               
            <h1 className='text-md text-gray-500 '>Skill*</h1>
            <input type="text" value={name} onChange={handleChange} className='border-2 w-full border-gray-200 rounded-lg  p-1 focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder={`${name}`}/>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
           <div className='mt-10'>
            <h1 className='text-md text-black font-bold'>Programming lanuages</h1>
            <div className='flex flex-wrap gap-2 mt-2 cursor-pointer'>
                {programmingLanguages.map((language,index)=>(
                    <button key={index} className='bg-gray-200  rounded-lg p-2'  onClick={()=>handleClick(language)} >
                     {language} 
                        </button>
                ))}
                
            </div>
            <div className='mt-10'>

               
            
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