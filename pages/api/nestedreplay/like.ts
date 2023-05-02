import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST"&&req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {currentUser}=await serverAuth(req,res)
            const nestedreplayId=req.method==="POST"?req.body.nestedreplayId:req.query.nestedreplayId
            if(!nestedreplayId || typeof nestedreplayId!="string") throw new Error("Invalid nestedreplay id")
            const nestedreplay=await prisma.nestedReplay.findUnique({
                where:{
                    id:nestedreplayId
                }
            })
            if(!nestedreplay) throw new Error("Invalid nestedreplay id")
            let updatedLikeIds=[...(nestedreplay.likesId || [])]
            if(req.method==="POST"){
                updatedLikeIds.push(currentUser.id)
            }
            else if(req.method==="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
            }
            const updatedNestedReplay=await prisma.nestedReplay.update({
                where:{
                    id:nestedreplayId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            return res.status(StatusCodes.OK).json(updatedNestedReplay)
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}