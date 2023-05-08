import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/router';
import useProjectModal from '@/hooks/projectModal';
import useGetProjects from '@/hooks/useGetProjects';
import Link from 'next/link';
import {GoLinkExternal} from "react-icons/go"
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
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
const Projects:React.FC = () => {
    const router=useRouter()
    const {userId}=router.query
    const projectModal=useProjectModal()
    const{data:projects} =useGetProjects(userId as string)
  
    
    return(
        <div className='w-full border-2 border-gray-300 rounded-lg my-1'>
            <div className='flex flex-col gap-2 border-2 border-gray-200 rounded '>
                <div className='flex justify-between p-2'>
                    <h1 className='text-lg font-bold text-gray-500'>Projects</h1>
                    <div className='flex gap-2 mr-2 items-center'>
                        <IoIosAddCircleOutline className='text-gray-500 text-xl cursor-pointer' size={30} title='Add Project' onClick={projectModal.onOpen}/>
                        <FiEdit2 className='text-gray-500 text-xl' size={25} title='Edit Project'/>
                    </div>

                </div>
            </div>
            {projects  &&
        
            projects && projects.map(project=>(
                <div className='flex justify-between items-center  gap-2 w-auto  my-2 mx-1'>
                    <div className=' flex flex-col p-2  cursor-pointer'>
                       
                        <h1 className='text-lg font-medium text-gray'>{project.name}</h1>
                     
                            <Link className='flex gap-2 border-2 rounded-full items-center border-gray-400 w-1/3 p-2 mt-2 hover:border-black' href={project.link} >

                            <p className='text-gray-500 ml-2'>Show project</p>
                            <GoLinkExternal className='text-gray-500' size={20}/>
                            </Link>

                       
                      
                        <p className='text text-md  text-gray-500'>{project.description}</p>
                    </div>

                       
                </div>
            ))
        }

        </div>
    )
}
export default Projects;