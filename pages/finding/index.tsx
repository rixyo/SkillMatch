import React, { useCallback, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useRouter } from 'next/navigation'
import Head from 'next/head';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';


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
const index:React.FC = () => {
    const [search,setSearch]=useState<string>("")
    const router=useRouter()
    const onSearch=useCallback((event:React.FormEvent)=>{
        event.preventDefault()
        const encodedSearch=encodeURI(search)
        router.push(`/search?q=${encodedSearch}`)
    

    },[search])
    
    return (
        <>
        <Head>
            <title>Search</title>
        </Head>
        <div className='w-auto mt-1 p-2' >
        <BsSearch className='w-5 h-5 absolute mt-1 ml-1  text-gray-500'/>
        <form onSubmit={onSearch}>
         <input
         placeholder="Search"
         className="border-2 border-none  h-8 pr-3 pl-10 py-2 font-semibold place-holder-gray-500 text-black rounded-lg ring-2 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full" 
         onChange={(e)=>setSearch(e.target.value)}
         value={search}
     
         />
        </form>
        </div>
        </>
    )
}
export default index;