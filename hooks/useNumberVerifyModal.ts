import {create} from "zustand"

interface VerifyModalState {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
   
   
   

}
const useNumberVerify = create<VerifyModalState>(set => ({
    isOpen: false,
    onOpen: () => set({isOpen: true,}),
    onClose: () => set({isOpen: false}),
  
   
    
}))
export default useNumberVerify;