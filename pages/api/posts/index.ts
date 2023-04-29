import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";
import {StatusCodes} from "http-status-codes"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
  }

  try {
    
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id
        }
      });

      return res.status(StatusCodes.OK).json(post);
    }

    else if (req.method === 'GET') {
      const { userId } = req.query;


      let posts;

      if (userId && typeof userId === 'string') {
        posts = await prisma.post.findMany({
          where: {
            userId
          },
          include: {
            user: true,
            comments: true
          },
          orderBy: {
            createdAt: 'desc'
          },
        });
      } else {
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
            
          
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }

      return res.status(StatusCodes.OK).json(posts);
    }
    
   
  
  
  } catch (error:any) {
    console.log(error);
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}