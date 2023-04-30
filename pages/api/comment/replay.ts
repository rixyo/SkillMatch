import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {currentUser}=await serverAuth(req,res)
    if(req.method!=="POST" && req.method!=="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            if(req.method==="POST"){
                const {body}=req.body
                const {commentId}=req.body
                if(!commentId || typeof commentId!="string") throw new Error("Invalid comment id")
                else if(!currentUser) throw new Error("You are not authorized to replay this comment")
                const comment=await prisma.comment.findUnique({
                    where:{
                        id:commentId
                    }
                })
                if(!comment) throw new Error("Invalid comment id")
                else{
                    const replay=await prisma.replay.create({
                        data:{
                            body,
                            userId:currentUser.id,
                            commentId:commentId
                        }
                    })
                    res.status(StatusCodes.OK).json(replay)
                }
            }
            else if(req.method==="GET"){
                const {commentId}=req.query
                if(!commentId || typeof commentId!="string") throw new Error("Invalid comment id")
                const replay=await prisma.replay.findMany({
                    where:{
                        commentId:commentId
                    },
                    include:{
                        user:true
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })
                res.status(StatusCodes.OK).json(replay)
            }
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
       
        
    }
}