import RegistrationModal from "@/components/Modals/RegistrationModal"
import { useCallback, useState } from "react"
import useEditModal from "./useEditModal"
import useLoginModal from "./useLoginModal"
import useRegisterModal from "./useRegisterModal"

const useToggle =()=>{
    const [loading,setLoading]=useState<boolean>(false)
    const RegistrationModal=useRegisterModal()
    const loginModal=useLoginModal()


    const register=useCallback(()=>{
        if(loading) return;
        loginModal.onClose()
        RegistrationModal.onOpen()
    },[loading,loginModal,RegistrationModal])
    const login=useCallback(()=>{
        if(loading) return;
        RegistrationModal.onClose()
        loginModal.onOpen()
    },[loading,loginModal,RegistrationModal])



    return {register,login,loading,setLoading}
}
export default useToggle
