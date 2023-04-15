import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import bcrypt from "bcrypt"
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method!=="POST") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        try {
            const {email,password,name}=req.body
            if(!email||!password||!name){
                throw new Error("Please enter all fields")
               
            }
            const hashedPassword=await bcrypt.hash(password,10)
            const customTag=`@${email.split("@")[0]}`
            const userExists=await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(userExists){
                throw new Error("User already exists with this email")
                
            }
            const user=await prisma.user.create({
                data:{
                    email,
                    hashedPassword,
                    customTag,
                    name,
                }

            })
            res.status(StatusCodes.OK).json({user})
            
        } catch (error:any) {
            console.log("login error",error)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
            
        }
    }

}