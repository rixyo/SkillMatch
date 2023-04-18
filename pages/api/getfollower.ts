import { NextApiRequest,NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        const {currentUser}=await serverAuth(req,res)
       
        try {
            const user=await prisma.user.findUnique({
                where:{
                    id:currentUser.id
                },
                select:{
                    followerId:true,
                }
                    
                
            })
            const followerIds = user?.followerId || [];
            const followers=await prisma.user.findMany({
              where:{id : {in:followerIds}},
            })
            res.status(StatusCodes.OK).json(followers)
          
            
            
        } catch (error:any) {
            console.log("geting user error",error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
            
        }
      
    }
}