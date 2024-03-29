//hastag bug

import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";
import {StatusCodes} from "http-status-codes"
import { Skill } from "@prisma/client";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }

  try {
    const mentionRegex = /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/g;
    const hashtagRegex = /(?<=^|(?<=[^a-zA-Z0-9-_\.]))#([A-Za-z]+[A-Za-z0-9_]+)/g;
   

    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { body,image } = req.body;
     

      const Mentioned = body.match(mentionRegex)
      const Hashtag = body.match(hashtagRegex)
   
      
    
     const post = await prisma.post.create({
       data: {
         body,
         image,
         userId: currentUser.id
       }
     })
     if(Hashtag){
      let list=post.hashTags||[]
      Hashtag.forEach((tag:string)=>{
        const withoutHash=tag.split("#")[1]
        list.push(withoutHash)
      })
      await prisma.post.update({
        where:{
          id:post.id
        },
        data:{
          hashTags:list
        }
      })
     }
     if (Mentioned) {
       const user=await prisma.user.findUnique({
         where:{
           customTag:Mentioned[0]
  
         }
       })
       if(!user) {
          await prisma.post.update({
            where:{
              id:post.id
            },
            data:{
              body:`${body}`,
            }
          })

       }
        else if(user){

          await prisma.notification.create({
            data:{
              userId:user?.id as string,
              fromId:currentUser.id,
              body:`${currentUser.name} mentioned you in a post`,
              type:"mention",
              link:`/post/${post.id}`
            },
          })
      
        
        await prisma.user.update({
          where:{
            id:user.id as string
          },
          data:{
            hasNotifications:true
          }
        })
      }
        }
        if (Hashtag) {
          
        }
      
  
   
    
  
     return res.status(StatusCodes.OK).json(post);
   
  

     
    }

    else if (req.method === 'GET') {
      
      const { userId } = req.query;
      const { currentUser } = await serverAuth(req, res)


      let posts;

      if (userId && typeof userId === 'string') {
        posts = await prisma.post.findMany({
          where: {
            userId
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                bio: true,
                customTag: true,
                isVarified: true,
              }

            },
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
        });
      } else {
        const skills=await prisma.skill.findMany({
          where:{
              userId:currentUser.id
          }
      })
        
        posts = await prisma.post.findMany({
          where:{
            AND:[
              {

                OR:[
                  {
                    hashTags:{
                      hasSome:skills.map((skill:Skill)=>skill.name.toLowerCase())
                    },
    
                  },
                  {
                    userId:{
                      in:currentUser.followingId.map((id)=>id)
                    },
                  },
                ]
              },
              {
                userId:{not:currentUser.id}
              }

            ],
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                bio: true,
                customTag: true,
                isVarified: true,
              }

            },
            comments: true,
            
          
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }

      return res.status(StatusCodes.OK).json(posts);
    }
    else if(req.method==="DELETE"){
      try {
          const {postId}=req.query
          const {currentUser}=await serverAuth(req,res)
          if(!postId || typeof postId!="string"){
              throw new Error("Invalid post id")
          }
          const existingPost=await prisma.post.findUnique({
              where:{
                  id:postId
              }
          })
          if(!existingPost){
              throw new Error("Post not found")
          }
          else if(existingPost.userId!==currentUser.id){
              throw new Error("You are not authorized to delete this post")
          }
          else {
          

            const Mentioned = existingPost.body.match(mentionRegex)
            if(existingPost.isShared){
              try {
                await prisma.notification.deleteMany({
                  where:{
                    userId:existingPost.fromSharedId as string,
                    fromId:currentUser.id,
                    type:"share",
                    link:`/post/${existingPost.id}`
                  }
                })
                await prisma.user.update({
                  where:{
                    id:existingPost.fromSharedId as string
                  },
                  data:{
                    hasNotifications:false
                  }
                })
                
              } catch (error:any) {
                console.log(error.message)
                
              }
            }
            
              const deletedPost=await prisma.post.delete({
                where:{
                    id:postId
                }
            })
              try {
                  if(Mentioned){
                    const user=await prisma.user.findUnique({
                      where:{
                        customTag:Mentioned[0]
      
                      }
                    })
                    if(!user) throw new Error("User not found")
                   
      
                      await prisma.notification.deleteMany({
                        where:{
                          userId:user?.id as string,
                          fromId:currentUser.id,
                          type:"mention",
                          link:`/post/${existingPost.id}`
                        },
                      })
                     
                    await prisma.user.update({
                      where:{
                        id:user.id
                      },
                      data:{
                        hasNotifications:false
                      }

                    })
                   
                    
                  }
                  
                
                  
              } catch (error:any) {
                  console.log(error.message)
                
                  
              }
              
                  res.status(StatusCodes.OK).json({deletedPost})
              
                
          }
          
      } catch (error:any) {
          console.log(error.message)
          res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
          
      }
     
      
      }
   
  
  
  } catch (error:any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

