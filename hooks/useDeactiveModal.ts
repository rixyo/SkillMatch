import {create} from "zustand"
interface DeactiveModalState {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

const useDeactiveModal = create<DeactiveModalState>(set => ({
    isOpen: false,
    onOpen: () => set({isOpen: true,}),
    onClose: () => set({isOpen: false}),
}))
module.exports = useDeactiveModal