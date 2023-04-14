import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import serverAuth from "@/libs/serverAuth";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {currentUser}=await serverAuth(req,res)
            res.status(StatusCodes.OK).json({user:currentUser})
            
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
            
        }
    }

}