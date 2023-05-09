import { NextApiRequest,NextApiResponse } from "next"
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="PATCH") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
           const {userId}=req.body
              if(!userId || typeof userId!="string") throw new Error("Invalid id")
            const user=await prisma.user.findUnique({
                where:{
                    id:userId
                }
            })
            if(!user) throw new Error("User not found")
             
            const updatedUser=await prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    isActived:false,
                }
            })
            res.status(StatusCodes.OK).json(updatedUser)
            
        } catch (error:any) {
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
}