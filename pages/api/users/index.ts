// Date: 08/05/23 modified by: @roixy
// added: find users best match by skills and level and not in currentUser following list
import { NextApiRequest, NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth"

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    if(req.method!=="GET") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        const {currentUser}=await serverAuth(req,res)
       
        try {
            //const currentUserSkills = currentUser.skill.map((skill) => skill);
            const skills=await prisma.skill.findMany({
                where:{
                    userId:currentUser.id
                }
            })
           
            
            const users=await prisma.user.findMany({
                where:{
                    AND:{
                        skills:{
                            some:{
                                AND:{
    
                                    name:{
                                        in:skills.map((skill)=>skill.name),
                                        
                                        
                                    },
                                   
                                    userId:{
                                        not:currentUser.id
                                    }
                                },
                               
                            }
                     },
                     id:{
                            not:{
                                in:currentUser.followingId.map((id)=>id)
                            }
                     },
                        isActived:true,

                    },
               
                
                   
                    
                   
                   
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    bio:true,
                    coverImage:true,
                    customTag:true,
                    isActived:true,
                    isVarified:true,
                    followerId:true,
                    followingId:true,
                    
                },
               orderBy:{
                    isVarified:"desc",

               },
               take:10
            })
            res.status(StatusCodes.OK).json(users)
            
        } catch (error:any) {
        
            res.status(StatusCodes.BAD_REQUEST).json(error.message)
            
        }
    }
    
    
}
