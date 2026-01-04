import { useState } from "react";

const INITIAL_CREW_DATA = {
    'Friend Captain': null,
    'Captain': null,
    'Support Captain': null,
    'Crewmate1': null, 'Support1': null,
    'Crewmate2': null, 'Support2': null,
    'Crewmate3': null, 'Support3': null,
    'Crewmate4': null, 'Support4': null
};

const INITIAL_TEXT_GUIDE = {notes:[], stages: []};

/**
 * FORM STATE MANAGER
 * ------------------
 * Centralizes all mutable state for the Multi-Step Submit Modal
 * 
 * Separates state into two categories:
 * 1. formData: The actual data that will be sent to the API (Title, URL, Members)
 * 2. selectionState: UI-only state (Which slot is currently being edited, which character is selected)
 */

export function useSubmitCrewState(){
    const [activeStep, setActiveStep] = useState(1);

    // Data payload for the API
    const [formData, setFormData] = useState({
        guideType: 'video',
        videoUrl: '',
        crewTitle: '',
        textGuideData: INITIAL_TEXT_GUIDE,
        crewMembers: INITIAL_CREW_DATA
    });

    // UI state for teh Character Selector view
    const [selectionState, setSelectionState] = useState({
        editingSlot: null,
        selectedChar: null
    });

    // --- Basic Setters & Handlers ---
    const updateFormData = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSlotClick = (slotId) => {
        setSelectionState({editingSlot:slotId, selectedChar: null});
    };


    const handleCharacterSelect = (character) => {
        setSelectionState(prev => ({...prev, selectedChar: character}));
    };

    const handleDetailsConfirm = (details) => {
        setFormData(prev => ({
            ...prev,
            crewMembers: {
                ...prev.crewMembers,
                [selectionState.editingSlot]: {
                    ...selectionState.selectedChar,
                    ...details 
                }
            }
    }));
    setSelectionState({editingSlot: null, selectedChar: null});
};

const resetForm = () =>{
    setFormData({
        guideType: 'video',
        videoUrl: '',
        crewTitle: '',
        textGuideData: INITIAL_TEXT_GUIDE,
        crewMembers: INITIAL_CREW_DATA
    });
    setActiveStep(1);
    setSelectionState({editingSlot: null, selectedChar: null});
};

return{
    activeStep, setActiveStep,
    formData, updateFormData,
    selectionState, setSelectionState,
    handleSlotClick,
    handleCharacterSelect,
    handleDetailsConfirm,
    resetForm,
    INITIAL_TEXT_GUIDE,
    INITIAL_CREW_DATA
};


}