import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {currentUser}=await serverAuth(req,res)
    if(req.method!=="POST" && req.method!=="GET" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            if(req.method==="POST"){
                const {body}=req.body
                const {commentId}=req.body
                const mentionRegex = /@(\w+)/g
               
             
                
              const postId=req.body.postId
                if(!commentId || typeof commentId!="string") throw new Error("Invalid id")
               
              
             
                    const replay=await prisma.replay.create({
                        data:{
                            body,
                            userId:currentUser.id,
                            commentId:commentId,
                            postId:postId
                           
                        }
                    })
                    try {
                        const mentonUser=body.match(mentionRegex)
                   
                        if(mentonUser){
                            const user=await prisma.user.findUnique({
                                where:{
                                    customTag:mentonUser[0]
                                }
                            })
                            if(!user) throw new Error("Invalid user")
                            else if(replay.userId!=user.id){

                                await prisma.notification.create({
                                    data:{
                                        userId:user.id,
                                        type:"replay",
                                        fromId:currentUser.id,
                                        link:`/replay/${replay.id}`,
                                        body:`${currentUser.name} mentioned you in a replay`
        
                                       
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
                        
                    } catch (error: any) {
                        console.log(error)
                        
                    }
                    try {
                        const comment=await prisma.comment.findUnique({
                            where:{
                                id:commentId
                            }
                        })
                        if(!comment) throw new Error("Invalid comment id")
                        else if(currentUser.id as string && comment.userId!=currentUser.id){
                           await prisma.notification.create({
                                data:{
                                    userId:comment.userId,
                                    type:"replay",
                                    fromId:currentUser.id,
                                    link:`/replay/${replay.id}`,
                                    body:`${currentUser.name}  replayed on your comment`
    
                                   
                                }
                            })
                            await prisma.user.update({
                                where:{
                                    id:comment.userId
                                },
                                data:{
                                    hasNotifications:true
                                }
                            })
                        }
                        
                    } catch (error: any) {
                        console.log(error)
                        
                    }
                    res.status(StatusCodes.OK).json(replay)
                
            }
            else if(req.method==="GET"){
                const {commentId}=req.query
                if(!commentId || typeof commentId!="string") throw new Error("Invalid comment id")
                const replay=await prisma.replay.findMany({
                    where:{
                        commentId:commentId
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
                        comment:true,
                        nestedReplays:true
                       
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })
                res.status(StatusCodes.OK).json(replay)
            }
            else if(req.method==="DELETE"){
                const {replayId}=req.query
                const mentionRegex = /@(\w+)/g
                if(!replayId || typeof replayId!="string") throw new Error("Invalid replay id")
                const replay=await prisma.replay.findUnique({
                    where:{
                        id:replayId
                    }
                })
                if(!replay) throw new Error("Invalid replay id")
                else if(replay.userId!=currentUser.id) throw new Error("You are not authorized to delete this replay")
                else{
                    const deletedReplay=await prisma.replay.delete({
                        where:{
                            id:replayId
                        }
                    })
                    try {
                        const mentonUser=replay.body.match(mentionRegex)
                        if(mentonUser){
                            const user=await prisma.user.findUnique({
                                where:{
                                    customTag:mentonUser[0]
                                }
                            })
                            if(!user) throw new Error("Invalid user")
                            await prisma.notification.deleteMany({
                                where:{
                                    link:`/replay/${replayId}`,
                                    fromId:currentUser.id,
                                    type:"replay",
                                    userId:user.id
    
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
                        if(currentUser.id as string){

                            await prisma.notification.deleteMany({
                                where:{
                                    link:`/replay/${replayId}`,
                                    fromId:currentUser.id,
                                    type:"replay",
                                    

    
                                }
                            })
                        }
                        const comment=await prisma.comment.findUnique({
                            where:{
                                id:replay.commentId
                            }
                        })
                        if(!comment) throw new Error("Invalid comment id")
                        await prisma.user.update({
                            where:{
                                id:comment.userId
                            },
                            data:{
                                hasNotifications:false
                            }
                        })
                        
                    } catch (error:any) {
                        console.log(error.message)
                        
                    }
                    res.status(StatusCodes.OK).json(deletedReplay)
                }
              
            }
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
       
        
    }
}