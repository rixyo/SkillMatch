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
                        user:true,
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
                    res.status(StatusCodes.OK).json(deletedReplay)
                }
              
            }
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
       
        
    }
}