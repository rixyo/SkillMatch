import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import serverAuth from "@/libs/serverAuth"
import prisma from "@/libs/prismadb"

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
                        user:{
                            select:{
                                id:true,
                                name:true,
                                bio:true,
                                customTag:true,
                                isVarified:true,
                            }
                        },
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
                const mentionRegex = /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/g;
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comment=await prisma.comment.create({
                    data:{
                        body,
                        postId,
                        userId:currentUser.id
                    }
                }) 
                try {
                    const mentionedUser=body.match(mentionRegex)
                    if(mentionedUser){
                        const user=await prisma.user.findUnique({
                            where:{
                                customTag:mentionedUser[0]
                            }
                        })
                        if(!user) throw new Error("Invalid user")
                        else if(user.id===currentUser.id) throw new Error("You can't mention yourself")
                        
                     

                        else if(user.id !==comment.userId ) {

                            await prisma.notification.create({
                                data:{
                                    userId:user.id,
                                    fromId:currentUser.id,
                                    type:"mention",
                                    link:`/post/${postId}`,
                                    body:`${currentUser.name} mentioned you in a comment`
                                }
                            })
                            await prisma.user.update({
                                where:{
                                    id:user.id
                                },
                                data:{
                                    hasNotifications:true
                                }
                            })
                        }
                        
                    }
                

                    
                } catch (error:any) {
                    console.log(error.message)
                    
                }
                try {
                    const post=await prisma.post.findUnique({
                        where:{
                            id:postId
                        }
                    })
                    if(!post) throw new Error("Invalid post id")
                    else if(!currentUser.id && typeof currentUser.id!="string") throw new Error("Invalid user id")
                    else if(post.userId!=currentUser.id) {

                        await prisma.notification.create({
                             data:{
                                 userId:post.userId,
                                 fromId:currentUser.id,
                                 type:"comment",
                                 
                                 
                                 link:`/post/${postId}`,
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
                        const mentionedUsers=comment.body.match(/@(\w+)/g)
                        if(mentionedUsers){
                            const user=await prisma.user.findUnique({
                                where:{
                                    customTag:mentionedUsers[0]
                                }
                            })
                            if(!user) throw new Error("Invalid user")
                            await prisma.notification.deleteMany({
                                where:{
                                    userId:user.id,
                                    link:`/post/${comment.postId}`,
                                    type:"mention",
                                    fromId:currentUser.id
                                    
                                }
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
                                    link:`/post/${comment.postId}`,
                                    type:"comment",
                                    fromId:currentUser.id
                                    
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
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}