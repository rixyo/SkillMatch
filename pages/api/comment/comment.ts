import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import serverAuth from "@/libs/serverAuth"
import prisma from "@/libs/prismadb"
import { data } from "autoprefixer"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET"&&req.method!="POST"&&req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        
        const {currentUser}=await serverAuth(req,res)
        try {
            const {postId}=req.query
            if(req.method==="GET"){
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comments=await prisma.comment.findMany({
                    where:{
                        postId
                    },
                    include:{
                        user:true,
                        replays:true
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })//findMany({where:{postId:postId}})
               
                res.status(StatusCodes.OK).json(comments)
            }
            else if(req.method==="POST"){
                const {body}=req.body
                const {postId}=req.query
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comment=await prisma.comment.create({
                    data:{
                        body,
                        postId,
                        userId:currentUser.id
                    }
                }) 
                try {
                    const post=await prisma.post.findUnique({
                        where:{
                            id:postId
                        }
                    })
                    if(!post) throw new Error("Invalid post id")
                    else if(currentUser.id as string){
                       await prisma.notification.create({
                            data:{
                                userId:post.userId,
                                type:"comment",
                                fromUserId:currentUser.id,
                                link:`/posts/${postId}`,
                                body:`${currentUser.name}  commented on your post`

                               
                            }
                        })
                        await prisma.user.update({
                            where:{
                                id:post.userId
                            },
                            data:{
                                hasNotifications:true
                            }
                        })
                    }
                    
                } catch (error:any) {
                    console.log(error.message)
                    
                    
                }
                res.status(StatusCodes.OK).json(comment)
            }
            else if(req.method==="DELETE"){
                const {commentId}=req.query
                if(!commentId || typeof commentId!="string") throw new Error("Invalid comment id")
                const comment=await prisma.comment.findUnique({
                    where:{
                        id:commentId
                    }
                })
                if(!comment) throw new Error("Invalid comment id")
                else if(comment.userId!=currentUser.id) throw new Error("You are not authorized to delete this comment")
                else{
                    const deletedComment=await prisma.comment.delete({
                        where:{
                            id:commentId
                        }
                    })
                    try {
                        const post=await prisma.post.findUnique({
                            where:{
                                id:comment.postId
                            }
                        })
                        if(!post) throw new Error("Invalid post id")
                        else if(currentUser.id as string){
                            await prisma.notification.deleteMany({
                                where:{
                                    link:`/posts/${comment.postId}`,
                                    type:"comment",
                                    fromUserId:currentUser.id
                                    
                                }
                            })
                        }
                        await prisma.user.update({
                            where:{
                                id:post.userId
                            },
                            data:{
                                hasNotifications:false
                            }
                        })

                        
                    } catch (error:any) {
                        console.log(error.message)
                        
                    }
                  
                        
                   
                  
                    res.status(StatusCodes.OK).json(deletedComment)
                }
                
            }

            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}