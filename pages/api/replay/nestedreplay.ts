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
                        user:true,
                        replay:true
                       
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })
               
                return res.status(StatusCodes.OK).json(replays)
            }
            else if(req.method==="DELETE"){
                const {replayId}=req.query
                if(!replayId || typeof replayId!="string") throw new Error("Invalid replay id")
                const replay=await prisma.nestedReplay.findUnique({
                    where:{
                        id:replayId
                    }
                })
                if(!replay) throw new Error("Invalid replay id")
                else if(replay.userId!=currentUser.id) throw new Error("You are not authorized to delete this replay")
                else{
                    const deletedReplay=await prisma.nestedReplay.delete({
                        where:{
                            id:replayId
                        }
                    })
                    return res.status(StatusCodes.OK).json(deletedReplay)
                }
            }
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
        
    }
}