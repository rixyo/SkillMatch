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
    const  line_items= [
        {
          price_data: {
            currency: 'BDT',
            product_data: {
              name: 'Registration fee',
            },
            unit_amount: 3000*100,
          },
          quantity: 1,
        },
      ]
    
    const submit=useCallback(async()=>{
        const {data} = await axios.post('http://localhost:5000/payment/create-payment-intent/', {line_items, id:"9d1f51d8-538b-43f2-b093-47d0e7ba7f41"}
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