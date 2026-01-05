import { useState, useCallback } from "react";

export const useHomeModals = () => {
    const [activeModal, setActiveModal] = useState(null) // 'BUILDER', 'TRANSFER' or null

    const openBuilder = useCallback(()=> setActiveModal('BUILDER'), []);
    const openTransfer = useCallback(()=> setActiveModal('TRANSFER'), []);
    const closeModal = useCallback(()=> setActiveModal(null), []);

    return{
        isOpenBuilder: activeModal === 'BUILDER',
        isOpenTransfer: activeModal === 'TRANSFER',
        openBuilder,
        openTransfer,
        closeModal
    };

};