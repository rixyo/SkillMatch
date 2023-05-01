import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {commentId}=req.query
            if(!commentId || typeof commentId!="string") throw new Error("Invalid id")
            const comments=await prisma.comment.findUnique({
                where:{
                    id:commentId
                },
               include:{
                     user:true,
                     replays:true,
                     
               }
            })
            if(!comments) throw new Error("Comment not found")
            
            res.status(StatusCodes.OK).json(comments)
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
        }
    }
}