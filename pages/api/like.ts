import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { link } from "fs";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            
          const postId= req.method === 'POST' ? req.body.postId : req.query.postId;
            const {currentUser}=await serverAuth(req,res)
            if(!postId || typeof postId!="string") throw new Error("Invalid post id")
            const post=await prisma.post.findUnique({
                where:{
                    id:postId
                }
            })
            if(!post) throw new Error("Invalid post id")
            let updatedLikeIds=[...(post.likesId||[])]
            if(req.method=="POST"){
                //if(updatedLikeIds.includes(currentUser.id)) throw new Error("Already liked")
               
                    updatedLikeIds.push(currentUser.id)
                    try {
                        const post=await prisma.post.findUnique({
                            where:{
                                id:postId
                            },
                          
                        })
                        if(post?.userId){
                            if(!currentUser.id && typeof currentUser.id!="string") throw new Error("Invalid user id")
                            if(updatedLikeIds.includes(currentUser.id)){

                                await prisma.notification.create({
                                    data:{
                                        userId:post.userId,
                                        body:`${currentUser.name} liked your post`,
                                        type:"like",
                                        fromUserId:currentUser.id,
                                        link:`/posts/${postId}`,
                                       
                                        
                                        isRead:false,
                                        
                                     
    
                                    }
                                })
                            }
                        

                            
                            await prisma.user.update({
                                where:{
                                    id:post.userId
                                } ,
                                data:{
                                    hasNotifications:true
                                }
                            })
                         
                        }
                        
                    } catch (error:any) {
                        console.log("geting user error",error.message)
                        //res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                        
                    }
            }
            if(req.method=="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
                if(post?.userId){
                    await prisma.notification.deleteMany({
                        where:{
                            fromUserId:currentUser.id as string,
                            userId:post.userId,
                            type:"like",
                            link:`/post/${postId}`
                        }
                    })
                }
                await prisma.user.update({
                    where:{
                        id:post?.userId
                    },
                    data:{
                        hasNotifications:false
                    }
                })
            }
            const updatedPost=await prisma.post.update({
                where:{
                    id:postId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            res.status(StatusCodes.OK).json(updatedPost)
            
        } catch (error:any) {
            console.log("geting user error",error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}