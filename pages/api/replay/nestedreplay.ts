import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET"&&req.method!="POST"&&req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {currentUser}=await serverAuth(req,res)
            if(req.method==="POST"){
                const {body}=req.body
                const {replayId}=req.body
                if(!body || typeof body!="string") throw new Error("Invalid body")
                else if(!req.body.replayId || typeof req.body.replayId!="string") throw new Error("Invalid replay id")
                const replay=await prisma.nestedReplay.create({
                    data:{
                        body,
                        userId:currentUser.id,
                        replayId
                       

                    }
                })
                try {
                    const replay=await prisma.replay.findUnique({
                        where:{
                            id:replayId
                        }
                    })
                    console.log(replay)
                    if(!replay) throw new Error("Invalid replay id")
                    else if(currentUser.id as string){
                        await prisma.notification.create({
                            data:{
                                userId:replay.userId,
                                type:"nestedreplay",
                                fromUserId:currentUser.id,
                                link:`/replay/${replay.id}`,
                                body:`${currentUser.name}  replayed on your replay`
                            }
                        })
                        await prisma.user.update({
                            where:{
                                id:replay.userId
                            },
                            data:{
                                hasNotifications:true
                            }
                        })
                    }
                   
                    
                } catch (error: any) {
                    console.log(error)
                    
                }
                return res.status(StatusCodes.OK).json(replay)
            }
            else if(req.method==="GET"){
                const {replayId}=req.query
                if(!replayId || typeof replayId!="string") throw new Error("Invalid replay id")
                const replays=await prisma.nestedReplay.findMany({
                    where:{
                        replayId:replayId
                    },
                    include:{
                        user: {
                            select: {
                              id: true,
                              name: true,
                              bio: true,
                              customTag: true,
                              isVarified: true,
                            }
              
                          },
                        replay:true
                       
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })
               
                return res.status(StatusCodes.OK).json(replays)
            }
            else if(req.method==="DELETE"){
                const {nestedreplayId}=req.query
                if(!nestedreplayId|| typeof nestedreplayId!="string") throw new Error("Invalid replay id")
                const nestedreplay=await prisma.nestedReplay.findUnique({
                    where:{
                        id:nestedreplayId
                    }
                })
                if(!nestedreplay) throw new Error("Invalid replay id")
                else if(nestedreplay.userId!=currentUser.id) throw new Error("You are not authorized to delete this replay")
                else{
                    const deletedReplay=await prisma.nestedReplay.delete({
                        where:{
                            id:nestedreplayId
                        }
                    })
                    try {
                        const replay=await prisma.replay.findUnique({
                            where:{
                                id:nestedreplay.replayId
                            }
                        })
                        if(replay){
                            if(!currentUser.id && typeof currentUser.id !="string") throw new Error("Invalid user id")

                            await prisma.notification.deleteMany({
                                where:{
                                    fromUserId:currentUser.id,
                                    link:`/replay/${replay.id}`,
                                    type:"nestedreplay",
                                 

                                }
                            })
                            await prisma.user.update({
                                where:{
                                    id:replay.userId
                                },
                                data:{
                                    hasNotifications:false
                                }
                            })
                        }
                        
                            
                        
                      
                        
                        
                        
                    } catch (error: any) {
                        console.log(error)
                        
                    }
                   
                    return res.status(StatusCodes.OK).json(deletedReplay)
                }
            }
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
        
    }
}