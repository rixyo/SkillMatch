import Avatar from '@/components/Avatar';
import useSearch from '@/hooks/useSearch';
import { formatDistanceToNowStrict } from 'date-fns';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';

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
    const search=useSearchParams()
    const router=useRouter()
    const serachQuery=search?search.get("q"):null
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;
    const mentionRegex =  /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/g;
    const encodedSearchQuery=encodeURI(serachQuery as string)
    const {data:searchResult}=useSearch(encodedSearchQuery as string)
   
  
   
    return (
        <div>
            
           { searchResult?.posts.length===0 && searchResult?.users.length===0 && <h1 className='text-center mt-5 text-xl'>No Result Found</h1>}
           {searchResult?.users.length>0 &&searchResult?.users?.map((user:any)=>(
                  <div key={user.id} className='flex flex-row gap-4 ml-5 mt-5 justify-start  ' onClick={()=>router.push(`/users/${user.id}`)}>
                  { <Avatar userId={user.id}/> }  
                    
                    <>
                    <div className='flex flex-col mt-3 cursor-pointer'>
                    <div className='flex items-center'>
                 <h1 className='font-bold text-xl'>{user.name}</h1>
                 {user.isVarified && <MdVerified className='text-blue-500  md:ml-2'/> }
                     </div>
                      <p className='text-gray-500 text-sm'>{user.customTag}</p>
                      {!linkRegex.test(user.bio) && <p className='text-gray-500'>{user.bio}</p> }  
            {user.bio?.match(linkRegex)&&(
                <div className='mt-0'>
                    <p>{user.bio.replace(linkRegex,"").trim()}</p>
                  {Array.from(user.bio.matchAll(linkRegex)).map((link:any,index)=>(
                       <li className='list-none'>
                         
                          <Link href={link[0]} key={index}>
                            <span className='text-blue-500 hover:underline cursor-pointer'> {link[0]}</span>
                          </Link>
                       </li>
                  ))}
                </div>
            )}
                </div>
              
                    </>
                     
 
 
                 </div>
           ))}
           <>
              {searchResult?.posts.length>0 && searchResult?.posts?.map((post:any)=>(
                <div
                onClick={() => router.push(`/posts/${post.id}`)}
                className="flex flex-col  border-2 border-solid border-gray-300 p-5 cursor-pointer rounded-lg   my-5 mx-2 hover:border-gray-200"
                key={post.id}
                >
                    <div className='flex items-start gap-1'>
                        <Avatar
                        userId={post.userId}
                        />
                        <div className='flex items-center md:gap-2 '  >
                            <p className='hidden md:block text-md  font-bold hover:underline'  >{post.user.name}</p>
                            <p className='truncate w-10 md:hidden  text-md   font-bold hover:underline' >{post.user.name}</p>
                           {post.user.isVarified && <MdVerified className='text-blue-500'/>}
                           <p className='hidden md:block  text-gray-500 text-lg'>{post.user.customTag}</p>
                           <p className='truncate w-10 md:hidden text-gray-500'>{post.user.customTag}</p>
                           <p className='text-gray-500 hidden md:block'>{formatDistanceToNowStrict(new Date(post.createdAt),{addSuffix:true})}</p>
                           <p className='truncate w-10 md:hidden text-gray-500'>{formatDistanceToNowStrict(new Date(post.createdAt),{addSuffix:true})}</p>
                       
                          
                        </div>
                                
        
                    </div>
                    <div className=' mx-5  p-3'>
                        <div>
        
                    {!linkRegex.test(post.body) && !mentionRegex.test(post.body) && <p className="text-md text-black break-words">{post.body}</p> }   
                       {post.body.match(linkRegex) &&!mentionRegex.test(post.body) && (
                            <div className="mt-2">
                                <p>{post.body.replace(linkRegex,"").trim()}</p>
                                {Array.from(post.body.matchAll(linkRegex)).map((link:any,index)=>(
                               <li className='list-none'>
                                
                                  <span className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                                  
                               </li>
                          ))}
                            </div>
                       )}
                        {post.body.match(mentionRegex) && !linkRegex.test(post.body) && (
                    <div className='flex items-center gap-2'>
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention:any,index)=>(
                            <li className='list-none'>
                            <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                        <p>{post.body.replace(mentionRegex,"").trim()}</p>
                    </div>
                )}
                {post.body.match(mentionRegex) && post.body.match(linkRegex) && (
                    <>
                       
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention:any,index)=>(
                          <li className='list-none'>
                          <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                        <p>{post.body.replace(mentionRegex,'').replace(linkRegex,'')}</p>
                        {Array.from(post.body.matchAll(linkRegex)).map((link:any,index)=>(
                          <li className='list-none'>
                           <Link href={link[0].startsWith("http") ? link[0] : `https://${link[0]}`}>
                            <span className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                         </Link>
                          </li>
                        ))}
                            
                    </>
                )}
        
                        </div>
                    </div>
                    <div className='flex items-center w-full gap-5 ml-2' >
                        <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='comment'/>
                     
                        <p className=' text-neutral-500 '>{post.comments?.length}</p>
                        <IoAnalyticsOutline className='text-2xl text-gray-500 hover:text-blue-300' title='Views'/>
                        <p className='text-gray-500'>{post.viewsId?.length || 0}</p> 
                  
                      
                        <div
                     
                      className="
                        flex 
                        flex-row 
                        items-center 
                        text-neutral-500 
                        gap-2 
                        cursor-pointer 
                        transition 
                        hover:text-red-500
                    ">
                     <AiOutlineHeart/>
                      <p>
                        {post.likesId.length}
                      </p>
                    </div>
                    
        
                    </div>
        
                </div>
              ))}
           </>
         

          
        </div>
    )
}
export default index;