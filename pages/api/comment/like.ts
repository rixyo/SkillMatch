import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            
          const commentId= req.method === 'POST' ? req.body.commentId : req.query.commentId;
            const {currentUser}=await serverAuth(req,res)
            if(!commentId || typeof commentId!="string") throw new Error("Invalid post id")
            const comment=await prisma.comment.findUnique({
                where:{
                    id:commentId
                }
            })
            if(!comment) throw new Error("Invalid comment id")
            let updatedLikeIds=[...(comment.likesId || [])]
            if(req.method=="POST"){
                if(updatedLikeIds.includes(currentUser.id)) throw new Error("Already liked")
               
                    updatedLikeIds.push(currentUser.id)
            }
            if(req.method=="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
            }
            const updatedComment=await prisma.comment.update({
                where:{
                    id:commentId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            res.status(StatusCodes.OK).json(updatedComment)
            
        } catch (error:any) {
            console.log("geting user error",error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}