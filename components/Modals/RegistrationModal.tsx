import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from './Modal';
import axios from 'axios';
import {toast} from "react-hot-toast"
import {signIn} from "next-auth/react"


const RegistrationModal:React.FC = () => {
    const RegistrationModal=useRegisterModal()
    const {login,loading,setLoading}=useToggle()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [name,setName]=useState("")
    const [customTag,setCustomTag]=useState("")
    const [customError,setError]=useState("")

    const emailRegex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/


  
    const onSubmit=(async()=>{
        setLoading(true)
        try {
          
             if(email.length<=0 || !emailRegex.test(email)){
                throw new Error("Email is required or invalid")
                
            }
            else if(name.length<=0){
                throw new Error("Name is required")
            }
            else if(customTag.length<=0){
                throw new Error("Custom Tag is required")
            }
            
            const isWhitespace = /^(?=.*\s)/;
            if (isWhitespace.test(password)) {
              throw new Error( "Password must not contain Whitespaces.")
            }
        
        
            const isContainsUppercase = /^(?=.*[A-Z])/;
            if (!isContainsUppercase.test(password)) {
              throw new Error( "Password must have at least one Uppercase Character.")
            }
        
        
            const isContainsLowercase = /^(?=.*[a-z])/;
            if (!isContainsLowercase.test(password)) {
              throw new Error( "Password must have at least one Lowercase Character.")
            }
        
        
            const isContainsNumber = /^(?=.*[0-9])/;
            if (!isContainsNumber.test(password)) {
              throw new Error( "Password must contain at least one Digit.")
            }
            const isContainsSymbol =
            /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
          if (!isContainsSymbol.test(password)) {
            throw new Error( "Password must contain at least one Special Symbol.")
          }
      
      
          const isValidLength = /^.{6,}$/;
          if (!isValidLength.test(password)) {
            throw new Error( "Password must be  minimam 6 Characters Long.")
          }
            else if(confirmPassword!==password){
               
                throw new Error("Password does not match")
               
            }

           else{
            await axios.post("/api/register",{
             email,
             password,
             name,
             customTag

         })
        
         toast.success("Account Successfully created")
         signIn("credentials",{email,password})
            RegistrationModal.onClose()
        } 
            
            
        } catch (error:any) {
            console.log("loginError",error.message)
            toast.error(error.message)
            setError(error.message)
            
        } finally {
            setLoading(false)
           
        }

    })

    const bodyContent=(
        <div className='flex flex-col gap-4 '>
            <Input
               placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                disabled={loading}
                data-cy="email"
            />
               <Input
               placeholder="Name"
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                disabled={loading}
            />
               <Input
               placeholder="custom Tag"
                type="text"
                value={customTag}
                onChange={(e)=>setCustomTag(e.target.value)}
                disabled={loading}
            />
            <Input
            placeholder="Password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                disabled={loading}
            />
            {customError && <p className='text-red-500 text-sm' >{customError}</p>}
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
            customError={customError}
            onSubmit={onSubmit}
            title="Sign Up"
            body={bodyContent}
            footer={footerContent}
            actionLabel="Sign Up"
         
        />
        </>
    )
}
export default RegistrationModal;