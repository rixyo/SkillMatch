import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes";
import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
    else{
        try {
            const {nestedreplayId}=req.query
            if(!nestedreplayId || typeof nestedreplayId!="string") throw new Error("Invalid nestedreplay id")
            const nestedreplay=await prisma.nestedReplay.findUnique({
                where:{
                    id:nestedreplayId
                },
                include:{
                    user:true,
                    replay:true
                }
            })
            return res.status(StatusCodes.OK).json(nestedreplay)
            
        } catch (error:any) {
            console.log(error.message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
            
        }
    }
}