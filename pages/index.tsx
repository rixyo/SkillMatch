import Form from "@/components/Form";
import Header from "@/components/Header/Heder";
import PostFeed from "@/components/posts/postFeed";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePosts from "@/hooks/usePosts";
import useToggle from "@/hooks/useToggle";
import Head from 'next/head';

import { FiLogIn } from "react-icons/fi";
import {CircleLoader} from "react-spinners"



export default function Home() {
  const {register}=useToggle()
  const {data:currentUser}=useCurrentUser()
  const {isLoading}=usePosts()

 
 
 




 
 return (
  <>
   <Head>
        <title>Skill Match</title>
        <meta name="description" content="Skill Match is a platfrom for those who is looking for same skilled  team member" />
        <meta property="og:title" content="Skill Match" />
        <meta property="og:description" content="Skill Match is a platfrom for those who is looking for same skilled  team member" />
        <meta property="og:url" content="https://" />
        <meta property="og:type" content="website" />
      </Head>
<Header label={"Home"}/>

{!currentUser &&  <div className='mx-5 w-auto sm:block md:hidden border-b-[1px] border-gray-400  p-3 mt-2'>
     <h1 className='text-center mt-2 text-2xl font-semibold'>New To Skill Mass</h1>
       <div className='flex items-center mt-2 border-2  justify-center border-solid border-gray-400 mb-3 rounded-lg p-1  cursor-pointer ' onClick={register}>
        <FiLogIn className=' text-gray-500 text-md mr-2' title='SignUp/Login'/>
        <p className='text-md font-semibold text-gray-500' >SignUp</p>
     </div>
   
        <p className='text-md  text-gray-500 md:p-1  '>By signing up, you agree to the <span className='underline text-blue-400 cursor-pointer'>Terms of Service</span> and <span className='underline text-blue-400 cursor-pointer'>Privacy Policy</span>, including <span className='underline text-blue-400 cursor-pointer'>Cookie</span> Use.</p>
   
     </div>
     
}
<Form placeholder="Share Your Ideas" />
{isLoading?<div className="flex justify-center items-center h-full">
  <CircleLoader color="#3B82F6" className="" size={50} />
</div> :  <PostFeed  />}

  </>
 )
}

