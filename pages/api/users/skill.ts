import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
   if(req.method !=="GET" && req.method !=="POST" && req.method !=="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if(req.method==="GET"){
            const {userId}=req.query

            try {
                if(!userId && typeof userId!="string") throw new Error("Invalid user id")
                const skills=await prisma.skill.findMany({
                    where:{
                        userId:userId as string
                    }
                })
                return res.status(StatusCodes.OK).json(skills)
                
                
            } catch (error:any) {
                return res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                
            }
        }
        else if(req.method==="POST"){
            const {name}=req.body
            const {currentUser}=await serverAuth(req,res)
            try {
                if(!name) throw new Error("name is required")
                else{
                  if(currentUser.skill.includes(name)) throw new Error("Skill already exists")
                  else{
                    const skill=await prisma.skill.create({
                        data:{
                            name,
                            userId:currentUser.id
                        }
                    })
                    const user=await prisma.user.findUnique({
                        where:{
                            id:currentUser.id
                        }
                    })
                    if(!user) throw new Error("User not found")
                  

                    let list=user.skill || []
                 
                     if (name.match(/[\s.]+/g)){
                        list.push(name.replace(/[\s.]+/g, '').toLowerCase())
                         
                    } else{

                        list.push(name.toLowerCase())
                    }
                       
                    
                 
                    await prisma.user.update({
                        where:{
                            id:currentUser.id
                        },
                        data:{
                            skill:list
                        }
                    })
                    return res.status(StatusCodes.OK).json(skill)
                  }
                   
                    
                }
            }catch (error:any) {
                return res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                
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
                return res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                
            }
        }
    }  


}
