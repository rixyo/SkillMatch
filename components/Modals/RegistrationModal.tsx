
import useRegisterModal from '@/hooks/useRegisterModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from './Modal';
import axios from 'axios';
import {toast} from "react-hot-toast"
import {signIn} from "next-auth/react"
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const RegistrationModal:React.FC = () => {
    const RegistrationModal=useRegisterModal()
    const {login,loading,setLoading}=useToggle()
    const [email,setEmail]=useState<string>("")
    const [password,setPassword]=useState<string>("")
    const [confirmPassword,setConfirmPassword]=useState<string>("")
    const [name,setName]=useState<string>("")
    const [serverError,setServerError]=useState<string>("")
    const [passwordType, setPasswordType] = useState<string>("password")
   
  
    const [customError,setError]=useState<string>("")

    const emailRegex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/


  const onNameChange=useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
  if(e.target.value.length>50) return
  setName(e.target.value)

    if(e.target.value.length>=50){
      setError("Name canot  be more than 50 characters")
    }
  },[setName,setError])
    const onSubmit=(async()=>{
        setLoading(true)
        try {
          
             if(email.length<=0 || !emailRegex.test(email)){
                throw new Error("Email is required or invalid")
                
            }
            else if(name.length<=0){
                throw new Error("Name is required")
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

         })
        
         toast.success("Account Successfully created")
         signIn("credentials",{email,password})
            RegistrationModal.onClose()
        } 
            
            
        } catch (error:any) {
            console.log("loginError",error. response?.data?.error)
            toast.error(error.response?.data?.error || error.message)
            setServerError(error.response?.data?.error || error.message)
            
        } finally {
            setLoading(false)
           
        }

    })
    const togglePassword=useCallback(()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       return;
      }
      setPasswordType("password")
    },[passwordType,setPasswordType])
    

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
              {serverError && <p className='text-red-500 text-sm' >{serverError}</p>}
               <Input
               placeholder="Name"
                type="text"
                value={name}
                onChange={onNameChange}
                disabled={loading}
            />
             <div className='flex'>
            <Input
         
            placeholder="Password"
                type={passwordType}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                disabled={loading}
                
            />
            <button className='absolute mt-5 mr-2 right-10' onClick={togglePassword}>{passwordType==="password"?<AiOutlineEye className='text-2xl text-gray-400'/>:<AiOutlineEyeInvisible className='text-2xl text-gray-400'/>}</button>
              </div> 
            {customError && <p className='text-red-500 text-sm' >{customError}</p>}
          
            <Input
         
            placeholder="Confirm Password"
                type={passwordType}
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