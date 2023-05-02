import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {replayId}=req.query
            if(!replayId || typeof replayId!="string") throw new Error("Invalid replay id")
            const replay=await prisma.replay.findUnique({
                where:{
                    id:replayId

                },
                include:{
                    user:true,
                    comment:true,
                    nestedReplays:true
                   
                    
                }
            })
           // if(!replay) throw new Error("Replay not found")
            res.status(StatusCodes.OK).json(replay)
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}