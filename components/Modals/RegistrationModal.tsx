import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from './Modal';

type LoginModalProps = {
    
};

const RegistrationModal:React.FC<LoginModalProps> = () => {
    const RegistrationModal=useRegisterModal()
    const {login,loading,setLoading}=useToggle()
    const loginModal=useLoginModal()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [error,setError]=useState("")

  
    const onSubmit=useCallback(async()=>{
        setLoading(true)
        try {
            RegistrationModal.onClose()
            
        } catch (error) {
            console.log("loginError",error)
            
        } finally {
            setLoading(false)
        }

    },[RegistrationModal])

    const bodyContent=(
        <div className='flex flex-col gap-4 '>
            <Input
               placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={loading}
            />
               <Input
               placeholder="Name"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={loading}
            />
               <Input
               placeholder="custom Tag"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={loading}
            />
            <Input
            placeholder="Password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                disabled={loading}
            />
             <Input
            placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                disabled={loading}
            />

        </div>
    )
   const footerContent=(
         <div className='text-neutral-400 text-center mt-4'  >
            <p >Already have an account? <span className='text-sky-500 cursor-pointer hover:underline' onClick={login} >Login</span></p>
            </div>
   )

    return(
        <>
        <Modal
            isOpen={RegistrationModal.isOpen}
            onClose={RegistrationModal.onClose}
            onSubmit={onSubmit}
            title="Sign Up"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Sign Up"
            disabled={loading}
        />
        </>
    )
}
export default RegistrationModal;