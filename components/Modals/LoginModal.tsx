import useLoginModal from '@/hooks/useLoginModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import { BiShow } from 'react-icons/bi';
import Input from '../Input';
import Modal from './Modal';

type LoginModalProps = {
    
};

const LoginModal:React.FC<LoginModalProps> = () => {
    const loginModal=useLoginModal()
    const {register,loading,setLoading}=useToggle()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
 
    const onSubmit=useCallback(async()=>{
        setLoading(true)
        try {
            loginModal.onClose()
            
        } catch (error) {
            console.log("loginError",error)
            
        } finally {
            setLoading(false)
        }

    },[loginModal])

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