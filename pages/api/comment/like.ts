import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            
          const commentId= req.method === 'POST' ? req.body.commentId : req.query.commentId;
            const {currentUser}=await serverAuth(req,res)
            if(!commentId || typeof commentId!="string") throw new Error("Invalid post id")
            const comment=await prisma.comment.findUnique({
                where:{
                    id:commentId
                }
            })
            if(!comment) throw new Error("Invalid comment id")
            let updatedLikeIds=[...(comment.likesId || [])]
            if(req.method=="POST"){
               
               
                    updatedLikeIds.push(currentUser.id)
                    try {
                        const comment=await prisma.comment.findUnique({
                            where:{
                                id:commentId
                            },
                            include:{
                                post:true
                            }
                        })
                        if(comment?.userId){
                            if(!currentUser.id && typeof currentUser.id!="string") throw new Error("Invalid user id")
                            if(updatedLikeIds.includes(currentUser.id)){

                                await prisma.notification.create({
                                    data:{
                                        userId:comment.userId,
                                        body:`${currentUser.name} liked your comment`,
                                        type:"like",
                                        fromUserId:currentUser.id,
                                        link:`/comment/${comment.id}`,
                                        isRead:false,
                                        
                                     
    
                                    }
                                })
                            }
                        
    
                            
                            await prisma.user.update({
                                where:{
                                    id:comment.userId
                                } ,
                                data:{
                                    hasNotifications:true
                                }
                            })
                        }
                        
                    } catch (error:any) {
                        console.log("geting user error",error.message)
                        
                    }
            }
            else if(req.method=="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
                try {
                    if(comment?.userId){
                        if(!currentUser.id && typeof currentUser.id!="string") throw new Error("Invalid user id")
                        if(updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)){
                            await prisma.notification.deleteMany({
                                where:{
                                    userId:comment.userId,
                                    fromUserId:currentUser.id,
                                    type:"like",
                                    link:`/comment/${comment.id}`

                                }
                            })

                        }
                        await prisma.user.update({
                            where:{
                                id:comment.userId
                            } ,
                            data:{
                                hasNotifications:false
                            }
                        })
                    }
                  
                   
                    
                } catch (error:any) {
                    console.log("geting user error",error.message)
                    
                }
            }
            const updatedComment=await prisma.comment.update({
                where:{
                    id:commentId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            res.status(StatusCodes.OK).json(updatedComment)
            
        } catch (error:any) {
            console.log("geting user error",error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}