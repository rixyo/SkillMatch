import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="PATCH") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
          const {currentUser}=await serverAuth(req,res)
            const {name,bio, profileImage, coverImage}=req.body
            if(!name) throw new Error("Please enter your name")
            

            const updatedUser=await prisma.user.update({
                where:{
                    id:currentUser.id
                },
                data:{
                    name,
                    bio,
                    profileImage,
                    coverImage
                }
                })
                res.status(StatusCodes.OK).json({updatedUser})
            
        } catch (error:any) {
            console.log("edit error",error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
        }
    }
    
}
