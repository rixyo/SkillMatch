// Date: 08/05/23 modified by: @roixy
// added: find skills by userId and without userId
import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth";
import { BiBody } from "react-icons/bi";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
   if(req.method !=="GET" && req.method !=="POST" && req.method !=="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if(req.method==="GET"){
            const {userId}=req.query
            let skills

            try {
                if(userId && typeof userId==="string"){
                    skills=await prisma.skill.findMany({
                        where:{
                            userId:userId 
                        }
                    })
                }
                else{
                    skills=await prisma.skill.findMany()
                }
                
                    
                
               
                return res.status(StatusCodes.OK).json(skills)
                
                
            } catch (error:any) {
                return res.status(StatusCodes.BAD_REQUEST).json(error.message)
                
            }
        }
        else if(req.method==="POST"){
            const {name}=req.body
            let skill
            const {currentUser}=await serverAuth(req,res)
            try {
                if(!name && typeof name !="string") throw new Error("name is required")
                else{
                    const existingSkill=await prisma.skill.findFirst({
                        where:{
                            name,
                            userId:currentUser.id
                        }
                    })
                    
                   
                    if(existingSkill) throw new Error("Skill already exists")
                  else{
                    const whitespaceRegex = /\s/g;
                    const isWhitespace = name.match(whitespaceRegex);

                    if(whitespaceRegex.test(name)) {
                     const nameWithWhitespace= name.replace(/\s/g, "");
                    skill=await prisma.skill.create({
                          data:{
                              name:nameWithWhitespace,
                              userId:currentUser.id
                          }
                      })
                    }
                    else{
                        skill=await prisma.skill.create({
                            data:{
                                name,
                                userId:currentUser.id
                            }
                        })
                    }
                 
                   
                       
                    
                 
                   
                    return res.status(StatusCodes.OK).json(skill)
                  }
                   
                    
                }
            }catch (error:any) {
                console.log(error.message)
                return res.status(StatusCodes.BAD_REQUEST).json(error.message)
                
            }
        }
        else if(req.method==="DELETE"){
            const {id}=req.body
            try {
                if(!id) throw new Error("id is required")
                else{
                    const skill=await prisma.skill.delete({
                        where:{
                            id
                        }
                    })
                    return res.status(StatusCodes.OK).json(skill)
                    
                }
            } catch (error:any) {
                return res.status(StatusCodes.BAD_REQUEST).json(error.message)
                
            }
        }
    }  


}
