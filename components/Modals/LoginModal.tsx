import useLoginModal from '@/hooks/useLoginModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from './Modal';
import {signIn} from "next-auth/react"
import toast from 'react-hot-toast';



const LoginModal:React.FC = () => {
    const loginModal=useLoginModal()
    const {register,loading,setLoading}=useToggle()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [customError,setError]=useState("")

 
    const onSubmit = useCallback(async () => {
        if(email.length<=0|| password.length<=0){
            setError("Email and password are required")
            return
            
        }else{

            try {
              setLoading(true);
        
              await signIn('credentials', {
                email,
                password,
              });
        
              toast.success('Logged in');
        
              loginModal.onClose();
            } catch (error) {
              toast.error('Something went wrong');
            } finally {
              setLoading(false);
            }
        }
      }, [email, password, loginModal]);

    const bodyContent=(
        <div className='flex flex-col gap-4 '>
            <Input
               placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={loading}
            />
            <div className='flex items-center'>
            <Input
            placeholder="Password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                disabled={loading}
                />

            </div>
 {customError && <p className='text-red-500 text-xl' >{customError}</p>}

        </div>
    )
    const footerContent=(
        <div className='text-neutral-400 text-center mt-4'  >
           <p >Donot have an account? <span className='text-sky-500 cursor-pointer hover:underline' onClick={register}  >Sign Up</span></p>
           </div>
  )
    return(
        <>
        <Modal
            isOpen={loginModal.isOpen}
            onClose={loginModal.onClose}
            onSubmit={onSubmit}
            title="Login"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Login"
            disabled={loading}
        />
        </>
    )
}
export default LoginModal;