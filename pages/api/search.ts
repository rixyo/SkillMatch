import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes";
import prisma from "@/libs/prismadb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const {q}=req.query
    if(req.method!="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if (!q || typeof q!="string") return res.status(StatusCodes.BAD_REQUEST).end()
        const users=await usersResult(q)
        const posts=await postsResult(q)
        const result={
            users,
            posts
        }
        res.status(StatusCodes.OK).json(result)

      
       
    }
}
async function usersResult(q:string){
    const users=await prisma.user.findMany({
        where:{
            name:{
                contains:q,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            name:true,
          customTag:true,
          isVarified:true,
          bio:true,
        }
    })
    return users
}
async function postsResult(q:string){
    const posts=await prisma.post.findMany({
        where:{
            body:{
                contains:q,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            body:true,
            userId:true,
            createdAt:true,
            likesId:true,
            comments:true,
            user:{
                select:{
                    id:true,
                    name:true,
                    customTag:true,
                    isVarified:true,
                    
                }
            }

        }
    })
    return posts
}