import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import serverAuth from "@/libs/serverAuth"
import prisma from "@/libs/prismadb"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET"&&req.method!="POST"&&req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        
        const {currentUser}=await serverAuth(req,res)
        try {
            if(req.method==="GET"){
                const {postId}=req.query
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comments=await prisma.comment.findMany({
                    where:{
                        postId
                    },
                    include:{
                        user:true,
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
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comment=await prisma.comment.create({
                    data:{
                        body,
                        postId,
                        userId:currentUser.id
                    }
                })//create({data:{body:body}})
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
                    res.status(StatusCodes.OK).json(deletedComment)
                }
                
            }

            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}