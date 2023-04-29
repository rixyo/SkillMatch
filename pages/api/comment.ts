import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST"&&req.method!="DELETE"&&req.method!="GET" && req.method!="PATCH") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {currentUser}=await serverAuth(req,res)
            if(req.method==="GET"){
                const {postId}=req.query
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comments=await prisma.comment.findMany({
                    where:{
                        postId:postId
                    },
                    include:{
                        user:true
                    },
                    orderBy:{
                        createdAt:"desc"
                    }
                })
                res.status(StatusCodes.OK).json(comments)
            }
            
            else if(req.method==="POST"){
                const {body}=req.body
                const {postId}=req.query
                if(!postId || typeof postId!="string") throw new Error("Invalid post id")
                const comment=await prisma.comment.create({
                    data:{
                        body,
                        userId:currentUser.id,
                        postId:postId
                    }
                })
                res.status(StatusCodes.OK).json(comment)
                

            }
            else if(req.method==="DELETE"){
                const commentId=req.query.commentId
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
            else if(req.method==="PATCH"){
                const {commentId}=req.query
                const {body}=req.body
                if(!commentId || typeof commentId!="string") throw new Error("Invalid comment id")
                const comment=await prisma.comment.findUnique({
                    where:{
                        id:commentId
                    }
                })
                if(!comment) throw new Error("Invalid comment id")
                else if(comment.userId!=currentUser.id) throw new Error("You are not authorized to edit this comment")
                else{
                    const updatedComment=await prisma.comment.update({
                        where:{
                            id:commentId
                        },
                        data:{
                            body
                        }
                    })
                    res.status(StatusCodes.OK).json(updatedComment)
                }
            }

          

            
        } catch (error:any) {
            console.log("geting user error",error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}