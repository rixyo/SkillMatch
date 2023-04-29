import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="POST" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            
          const postId= req.method === 'POST' ? req.body.postId : req.query.postId;
            const {currentUser}=await serverAuth(req,res)
            if(!postId || typeof postId!="string") throw new Error("Invalid post id")
            const post=await prisma.post.findUnique({
                where:{
                    id:postId
                }
            })
            if(!post) throw new Error("Invalid post id")
            let updatedLikeIds=[...(post.likesId||[])]
            if(req.method=="POST"){
                if(updatedLikeIds.includes(currentUser.id)) throw new Error("Already liked")
               
                    updatedLikeIds.push(currentUser.id)
            }
            if(req.method=="DELETE"){
                if(updatedLikeIds.includes(currentUser.id)){
                    updatedLikeIds=updatedLikeIds.filter((id:string)=>id!=currentUser.id)
                }
            }
            const updatedPost=await prisma.post.update({
                where:{
                    id:postId
                },
                data:{
                    likesId:updatedLikeIds
                }
            })
            res.status(StatusCodes.OK).json(updatedPost)
            
        } catch (error:any) {
            console.log("geting user error",error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}