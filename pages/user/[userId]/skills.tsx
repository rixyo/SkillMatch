import useGetSkill from '@/hooks/useGetSkill';
import useSkillModal from '@/hooks/useSkillModal';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { IoIosAddCircleOutline } from 'react-icons/io';

export async function getServerSideProps(context:NextPageContext) {
    const session = await getSession(context)
    if(!session){
        return{
            redirect:{
            destination:"/",
            permanent:false
            }
        }
    }
    return {
        props: { session },
    }
  }


const Skill:React.FC= () => {
    const router=useRouter()
    const {userId}=router.query
    const skillModal=useSkillModal()
    const {data:skills}=useGetSkill(userId as string)
   
    
    return(
        <div className='w-full border-2 border-gray-300 rounded-lg my-1'>

        <div className='flex flex-col gap-2 border-2 border-gray-200 rounded '>
            <div className='flex justify-between p-2'>
                <h1 className='text-lg font-bold text-gray-500'>Skills</h1>
                <div className='flex gap-2 mr-2 items-center'>
                    <IoIosAddCircleOutline className='text-gray-500 text-xl cursor-pointer' onClick={skillModal.onOpen} size={30} title='Add Skill'/>
                    <FiEdit2 className='text-gray-500 text-xl' size={25} title='Edit Skill'/>
                </div>
            </div>
            
          
        </div>
      
        {
        
            skills && skills.map(skill=>(
                <div className='flex justify-between p-1  items-center  gap-2 w-auto  my-2 mx-1'>
                    
                        <div>
                        <h1 className='text-lg font-bold text-black hover:underline '>{skill.name}</h1>
                     
                        </div>
                        <div>
                        <p className='text text-md  text-gray-500'>{skill.level}</p>
                        </div>
                       
                    
                </div>
            ))
        }
        </div>
    )
}
export default Skill;