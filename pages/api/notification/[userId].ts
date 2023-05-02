import { NextApiResponse,NextApiRequest } from "next";
import {StatusCodes} from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {userId}=req.query
           
            if(!userId || typeof userId!="string") throw new Error("Invalid user id")
           const notifications=await prisma.notification.findMany({
                where:{
                    userId
                },
                orderBy:{
                    createdAt:"desc"
                }
           })
          const updateUser=await prisma.user.update({
                where:{
                    id:userId
                },
                data:{
                   hasNotifications:false

                    
                }
          })
            res.status(StatusCodes.OK).json(notifications)
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
            
        }
    }
}