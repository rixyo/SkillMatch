import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="POST") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if(req.method==="POST"){

            const {postId}=req.body
            const {currentUser}=await serverAuth(req,res)
            try {
                if(!postId && typeof postId!=="string") throw new Error("postId is required")
                const post=await prisma.post.findUnique({
                    where:{
                        id:postId
                    }
                })
                if(!post) throw new Error("Post not found")
                if(post.userId===currentUser.id) throw new Error("You can't share your own post")
                const sharedPost=await prisma.post.create({
                    data:{
                        body:post.body,
                        image:post.image,
                        userId:currentUser.id,
                        isShared:true,
                        fromSharedId:post.userId,
                        postSharedCreatedAt:post.createdAt
    
    
                    }
                })
                await prisma.notification.create({
                    data:{
                        userId:post.userId,
                        fromId:currentUser.id,
                        body:`${currentUser.name} shared your post`,
                        type:"share",
                        link:`/post/${sharedPost.id}`
                    }
                })
                await prisma.user.update({
                    where:{
                        id:post.userId
                    },
                    data:{
                        hasNotifications:true
                    }
                })
                 
         
      
       
        return res.status(StatusCodes.OK).json(sharedPost);
        }
        catch (error:any) {
           res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
           
       }
 } 
   
 
            
    }
}