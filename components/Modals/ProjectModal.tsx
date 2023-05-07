import useProjectModal from '@/hooks/projectModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import useGetProjects from '@/hooks/useGetProjects';
import axios from 'axios';
import { setMonth } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';


const ProjectModal:React.FC= () => {
    const projectModal=useProjectModal()
    const router=useRouter()
    const {userId}=router.query
    const {mutate:mutatedProject}=useGetProjects(userId as string)
   const [name,setName]=useState<string>('')
   const [link,setLink]=useState<string>('')
    const [description,setDescription]=useState<string>('')
    const [startMonth,setStartMonth]=useState<string>('')
    const [startYear,setStartYear]=useState<string>('')
    const [endMonth,setEndMonth]=useState<string>('')
    const [endYear,setEndYear]=useState<string>('')
    const [error,setError]=useState<string>('')
   




    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      
      const years = Array.from({length: 30}, (_, i) => 2022 - i);
      const {data:user}=useCurrentUser()

      years.sort((a, b) => b - a);
      const handleStartMonth = (event:React.ChangeEvent<HTMLOptionElement>) => {
        setStartMonth(event.target.value);
      }
      const handleStartYear = (event:React.ChangeEvent<HTMLOptionElement>) => {
        setStartYear(event.target.value);
      }
        const handleEndMonth = (event:React.ChangeEvent<HTMLOptionElement>) => {
        setEndMonth(event.target.value);
        }
        const handleEndYear = (event:React.ChangeEvent<HTMLOptionElement>) => {
        setEndYear(event.target.value);
        }
        const handleDescription = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
            if(event.target.value.length>200) return
            setDescription(event.target.value);
            
        }

     const handleSubmit=useCallback(()=>{
            if(name.length<=0 ||link.length<=0||description.length<=0){
                setError('Please fill all the required fields')
                return
            }
            setError('')
            axios.post('/api/users/project',{
                name,
                link,
                description,
              

            }).then(()=>{
                projectModal.onClose()
                toast.success('Project Added Successfully')
                mutatedProject()
                setName('')
                setLink('')
                setDescription('')
            }).catch((error)=>{
                toast.error(error.response.data.message)
            })

     },[user,name,link,description])

    const body=(
      <div className='w-full gap-5'>
      <div className='flex flex-col gap-2'>
          <h1>Project Name*</h1>
          <input type='text' value={name} onChange={(e)=>setName(e.target.value)} className='border-2  p-2border-2 border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'/>

      </div>
      <div className='mt-5' >

          <h1 className='mt-2'>Start Date</h1>
      <div className='flex gap-2 mt-2'>
      <select className='w-2/4 h-10'>
          <option>Month</option>
          {months.map((month,index)=>(
              <option key={index} value={month} onChange={handleStartMonth}>{month}</option>
          ))}
  </select>
  <select className='w-2/4 h-10'>
          <option>Year</option>
          {years.sort() &&years.map((year,index)=>(
              <option key={index} value={year} onChange={handleStartYear} >{year}</option>
          ))}
  </select>
      </div>
      </div>
      <div className='mt-5' >

        <h1 className='mt-2'>End Date</h1>
        <div className='flex gap-2 mt-2'>
        <select className='w-2/4 h-10'>
        <option>Month</option>
        {months.map((month,index)=>(
            <option key={index} value={month} onChange={handleEndMonth}>{month}</option>
        ))}
        </select>
        <select className='w-2/4 h-10'>
        <option>Year</option>
        {years.sort() &&years.map((year,index)=>(
            <option key={index} value={year} onChange={handleEndYear}>{year}</option>
        ))}
        </select>
        </div>
        </div>

     
      <div className='flex flex-col gap-2 mt-5'>
          <h1>Project/Github URL*</h1>
          <input type='url' value={link} onChange={(e)=>setLink(e.target.value)}  className='border-2  p-2border-2 border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'/>

      </div>

    
      <div className='flex flex-col gap-2 mt-5'>
          <h1>Description*</h1>
          <textarea className='border-2  p-2border-2 border-gray-200 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500' maxLength={200} value={description} onChange={handleDescription}/>

      </div>
      {error&&<p className='text-red-500'>{error}</p>}


  </div>
    )
    
    return (
       <Modal 
         isOpen={projectModal.isOpen}
            onClose={projectModal.onClose}
            title='Add Project'
            onSubmit={handleSubmit}
            body={body}
            actionLabel='save'
       />
       
    )
}
export default ProjectModal;