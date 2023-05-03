import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        const {currentUser}=await serverAuth(req,res)
        try {
            const users=await prisma.user.findMany({
                where:{
                    NOT:{
                        id:{
                            in:currentUser.followingId.map((id)=>id)
                        }
                    }
                },
               orderBy:{
                     createdAt:"desc"
               },
               take:10
            })
            res.status(StatusCodes.OK).json(users)
            
        } catch (error:any) {
            console.log("geting user error",error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
            
        }
    }
    
    
}