const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { NextApiRequest,NextApiResponse } from "next";
import prisma from "@/libs/prismadb"


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
        const {userId}=req.body
      const session = await stripe.checkout.sessions.create({
        line_items:req.body.line_items,
        
        mode: 'payment',
        success_url: "http://localhost:3000/success",
        cancel_url: `${req.headers.origin}/?canceled=true`,
        payment_method_types: ['card'],
      })
      await prisma.user.update({
        where:{
          id:userId
        },
        data:{
          isVarified:true
        }
      })
      
      res.status(200).json(session)
    } catch (err:any) {
      console.log(err)
      res.status(err.statusCode || 500 ).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}