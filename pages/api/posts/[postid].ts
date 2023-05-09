import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="GET" && req.method!=="DELETE" && req.method!=="PATCH") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if(req.method==="GET"){
            const {currentUser}=await serverAuth(req,res)
            
            try {
                const {postid}=req.query
                if(!postid || typeof postid!=="string"){
                    throw new Error("Invalid post id")
                    
                }
                const existingPost=await prisma.post.findUnique({
                    where:{
                        id:postid
                    },
                    include:{
                        user:{
                            select:{
                                name:true,
                                email:true,
                                id:true,
                                customTag:true,
                                isVarified:true,
                            }
                        },
                        comments:true
                    }
                })
                let updatedViewsId = [...(existingPost?.viewsId || [])]
                if(!existingPost) throw new Error("Post not found")
                if(!updatedViewsId.includes(currentUser.id)){
                    updatedViewsId.push(currentUser.id)
                    await prisma.post.update({
                        where:{
                            id:existingPost.id
                        },
                        data:{
                            viewsId: updatedViewsId
                                
                            
                        }
                    })
                }
               
              
            
                res.status(StatusCodes.OK).json({...existingPost})
                
                  
              
                
            } catch (error:any) {
                res.status(StatusCodes.BAD_REQUEST).json(error.message)
                
            }
        }
       
            else if (req.method ==="PATCH"){
                try {
                    const mentionRegex = /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/g;
                    const {postid}=req.query
                    const {currentUser}=await serverAuth(req,res)
                    if(!postid || typeof postid!="string"){
                        throw new Error("Invalid post id")
                    }
                    const existingPost=await prisma.post.findUnique({
                        where:{
                            id:postid
                        }
                    })
                    if(!existingPost){
                        throw new Error("Post not found")
                    }
                    else if(existingPost.userId!==currentUser.id){
                        throw new Error("You are not authorized to edit this post")
                    }
                    else{
                        const {body}=req.body
                        if(!body || typeof body!="string"){
                            throw new Error("body cannot be empty")
                        }
                        const Mentioned = body.match(mentionRegex)
                        if (Mentioned) {
                            const user=await prisma.user.findUnique({
                              where:{
                                customTag:Mentioned[0]
                       
                              }
                            })
                          
                              if(user){
                               
                               
                     
                               await prisma.notification.create({
                                 data:{
                                   userId:user?.id as string,
                                   fromId:currentUser.id,
                                   body:`${currentUser.name} mentioned you in a post`,
                                   type:"mention",
                                   link:`/post/${postid}`
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
                             const hintRegex = /\bhints\w*\b/gi
                             const hint = body.match(hintRegex)
                             let updatedPost;
                                if(hint){
                                    updatedPost=await prisma.post.update({
                                        where:{
                                            id:postid
                                        },
                                        data:{
                                            body:body.split("hints")[0]
                                        }
                                    })

                                }
                                else{

                                    updatedPost=await prisma.post.update({
                                          where:{
                                              id:postid
                                          },
                                          data:{
                                              body
                                          }
                                      })
                                }

                        
                            
                            res.status(StatusCodes.OK).json(updatedPost)
                        
                    }
                    
                } catch (error:any) {
                    console.log(error.message)
                    res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                    
                }
               
    
            }
    }
        
}