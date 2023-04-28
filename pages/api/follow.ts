import { NextApiRequest, NextApiResponse } from 'next'
const { StatusCodes } = require('http-status-codes')
import prisma from '@/libs/prismadb'
import serverAuth from '@/libs/serverAuth'
export default async function handler(req:NextApiRequest,res:NextApiResponse){
if(req.method !== 'POST' && req.method !== 'DELETE') return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({message:'Method not allowed'})
  try {
    const {userId} = req.body
    const {currentUser} = await serverAuth(req,res)
    console.log(userId)
    if(!userId || typeof userId !== 'string'){
      throw new Error('Invalid ID')
    }
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })
    if(!user){
      throw new Error('Invalid ID')
    }
    let updatedFollowerIds = [...(user.followerId || [])]
    let updatedFollowingIds = [...(currentUser.followingId || [])]
    if(req.method === 'POST'){
      if(!updatedFollowerIds.includes(currentUser.id)&&userId!==currentUser.id&& !updatedFollowingIds.includes(userId)){
        
        updatedFollowerIds.push(currentUser.id)
        updatedFollowingIds.push(userId)
        //updatedFollowingIds.shift()
        updatedFollowingIds = updatedFollowingIds.filter((id:string) => id !== currentUser.id)

      }
    }
    if(req.method === 'DELETE'){
      if(updatedFollowerIds.includes(currentUser.id)){
        updatedFollowerIds = updatedFollowerIds.filter((id:string) => id !== currentUser.id)
      }
      if(updatedFollowingIds.includes(userId)){
        updatedFollowingIds = updatedFollowingIds.filter((id:string) => id !== userId)
      }
    }
    const updatedUser = await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        followerId:updatedFollowerIds
      }
    })
    const updatedCurrentUser = await prisma.user.update({
      where:{
        id:currentUser.id
      },
      data:{
        followingId:updatedFollowingIds
      }
    })
    return res.status(StatusCodes.OK).json({updatedUser,updatedCurrentUser})

    
  } catch (error:any) {
    return res.status(StatusCodes.BAD_REQUEST).json({message:error.message})
    
  }
}