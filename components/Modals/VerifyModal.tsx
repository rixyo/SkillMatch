import useVerifyModal from '@/hooks/useVerifyModal';
import React, { useCallback } from 'react';
import Modal from './Modal';
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios';
import currentUser from '@/hooks/useCurrentUser';
const VerifyModal:React.FC = () => {
    const verifyModal=useVerifyModal();
    const {data:loginUser}= currentUser();

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
    console.log(loginUser)
    const getLineItems = () => { 
   
      return [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 30 * 100,
          product_data: {
            name:loginUser?.user?.name,
            description: 'Verification fee',
         
          },
        },
        quantity: 1,
      }
      ];
    };
    
    const submit=useCallback(async()=>{
        const {data} = await axios.post('/api/payment', {line_items:getLineItems(), userId:loginUser?.user?.id}
        )
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({sessionId: data.id})

    },[loginUser])
    const body=(
        <div >
            <div className='h-1/2  bg-gradient-to-r from-cyan-500 to-blue-300 p-2 border-2 border-dotted'>
                <div className=' h-auto w-1/2 bg-white text-center ml-40  border-2 border-gray-200 rounded '>
                  < p className='text-lg text-black font-bold self-center p-2' >Blue subscribers with a verified phone number will get a blue checkmark once approved.</p>
                   
                </div>
            </div>
            <div className='w-1/2  ml-44  p-2' >

            <h1 className='mt-5 text-lg font-semibold'>Blue</h1>
            <li className=''>Prioritized rankings in conversations and search</li>
            <li className=''>Verified badge</li>
            <li className=''>Share your code</li>
            </div>
            
   
        </div>
    )
    
    return (
        <Modal
        isOpen={verifyModal.isOpen}
        onClose={verifyModal.onClose}
        title="Verify your account"
        onSubmit={submit}
        actionLabel="$30 application fee"
        body={body}
        />
    )
}
export default VerifyModal;