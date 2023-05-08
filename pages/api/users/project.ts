// Date: 08/05/23
// added: find projects by userId and without userId
import { NextApiRequest,NextApiResponse } from "next";
import {StatusCodes} from "http-status-codes"
import prisma from "@/libs/prismadb"
import serverAuth from "@/libs/serverAuth";


export default async function handler(req:NextApiRequest,res:NextApiResponse){
  
    if(req.method!="GET" && req.method!="POST" && req.method!="PATCH" && req.method!="DELETE") return res.status(StatusCodes.METHOD_NOT_ALLOWED).end()
    else{
        if(req.method==="GET"){
            const {userId}=req.query
            try {
                let projects
                if(userId && typeof userId==="string") {
                    projects=await prisma.project.findMany({
                        where:{
                            userId
                        }
                    })
                   
                }else{
                    projects=await prisma.project.findMany()
                }
                res.status(StatusCodes.OK).json(projects)
                
                  
            } catch (error:any) {
                res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                
            }
            
        }
        else if(req.method==="POST"){
            const {name,description,link}=req.body
            const {currentUser}=await serverAuth(req,res)
            try {
                
                if(!name || !description || !link) throw new Error("name,description,link,userId is required")
                else{
                   
                    const project=await prisma.project.create({
                        data:{
                            name,
                            description,
                            link,
                            userId:currentUser.id
                        }
                    })
                    res.status(StatusCodes.OK).json(project)
                }
            } catch (error:any) {
                res.status(StatusCodes.BAD_REQUEST).json({error:error.message})
                
            }
        }
        else if(req.method==="PATCH"){
            const {id,name,description,link}=req.body
            if(!id || !name || !description || !link)  throw new Error("id,name,description,link is required")
            else{
                const project=await prisma.project.update({
                    where:{
                        id
                    },
                    data:{
                        name,
                        description,
                        link
                    }
                })
                res.status(StatusCodes.OK).json(project)
            }
        }
     
    }
}