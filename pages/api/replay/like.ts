import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST"&&req.method!=="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {currentUser}=await serverAuth(req,res)
            const replayId=req.method==="POST"?req.body.replayId:req.query.replayId
            if(!replayId || typeof replayId!="string") throw new Error("Invalid replay id")
            const replay=await prisma.replay.findUnique({
                where:{
                    id:replayId
                }
            })
            if(!replay) throw new Error("Invalid replay id")
            let updatedLikeIds=[...(replay.likesId || [])]
            if(req.method==="POST"){
               
                updatedLikeIds.push(currentUser.id)
            }
            else if(req.method==="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
            }
            const updatedReplay=await prisma.replay.update({
                where:{
                    id:replayId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            res.status(StatusCodes.OK).json(updatedReplay)
            
        } catch (error:any) {
            console.log("ReplayError",error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}