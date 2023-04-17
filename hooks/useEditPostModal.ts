import {create } from "zustand"

interface EditPostModalState {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}
const usePostEditModal=create<EditPostModalState>(set=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))
export default usePostEditModal;