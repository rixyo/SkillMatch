import useLoginModal from '@/hooks/useLoginModal';
import useToggle from '@/hooks/useToggle';
import React, { useCallback, useState } from 'react';
import Input from '../Input';
import Modal from './Modal';
import {signIn} from "next-auth/react"
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import AuthSocialButton from '../AuthSocialButton';
import { BsGoogle } from 'react-icons/bs';
import router from 'next/router';




const LoginModal:React.FC= () => {
    const loginModal=useLoginModal()
   
   
   
    const {register,loading,setLoading}=useToggle()
    const [email,setEmail]=useState<string>("")
    const [password,setPassword]=useState<string>("")
    const [customError,setError]=useState<string>("")
    const [passwordType, setPasswordType] = useState<string>("password")

 
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
            } catch (error:any) {
              toast.error(error.response?.data?.error || error.message);
            } finally {
              setLoading(false);
            }
        }
      }, [email, password, loginModal]);


      const togglePassword=useCallback(()=>{
        if(passwordType==="password")
        {
         setPasswordType("text")
         return;
        }
        setPasswordType("password")
      },[passwordType,setPasswordType])
    
      const socialAction = (action:string) => {
        setLoading(true);
    
        signIn(action, { redirect: false })
          .then((callback) => {
            if (callback?.error) {
              console.log(callback?.error);
              toast.error(callback?.error);
            }
    
            else if (callback?.ok) {
              toast.success("Logged in")

              router.push('/')
            }
          })
          .finally(() => setLoading(false));
      } 
    const bodyContent=(
        <div className='flex flex-col gap-4 '>
          <AuthSocialButton 
            icon={BsGoogle}
            onClick={() => socialAction("google")}
          />
          <span className='text-center text-neutral-400'>or</span>
            <Input
               placeholder="Email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
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