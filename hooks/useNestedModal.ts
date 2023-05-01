import {create } from "zustand"

interface NestedModalState {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
}
const useNestedModal=create<NestedModalState>(set=>({
    isOpen:false,
    onOpen:()=>set({isOpen:true}),
    onClose:()=>set({isOpen:false})
}))
export default useNestedModal;