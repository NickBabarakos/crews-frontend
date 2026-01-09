import {useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';
import { useCreatorVerification } from './useCreatorVerification';
import { submitCrew } from '../../api/crewsService';
import { getEventNames } from '../../api/stageService';
import { useSubmitCrewState } from './useSubmitCrewState';
import { isDynamicStage} from '../utils/stageGuideUtils';

const isValidUrl = (string) => {
    if(!string) return false;
    try{
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch(_){
        return false;
    }
};

const isValidPublicKey = (key) => {
    if(!key) return false;
    const regex = /^pub-[a-fA-F0-9]{8}-[a-fA-F0-9]{8}$/;
    return regex.test(key);
};

/**
 * SUBMIT MODAL CONTROLLER
 * -----------------------
 * The "brain" of the SubmitCrewModal.
 * Integratees From State, Verification Logic and API Submission.
 */

export function useSubmitCrew(isOpen, onClose, stageName, stageId, myKeys){

    // 1. Load Form State Logic
    const {
        activeStep, setActiveStep,
        formData, updateFormData,
        selectionState, setSelectionState,
        handleSlotClick, handleCharacterSelect, handleDetailsConfirm, resetForm
    } = useSubmitCrewState();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [displayStageName, setDisplayStageName] = useState(stageName);

    // 2. Load Verification Logic
    const verification = useCreatorVerification(myKeys);
        
    const isNewCreator = verification.verificationStep === 'not_found' || verification.verificationStep === 'valid_key_no_creator';

    //---EFFECTS---

    /**
     * EFFECT: Dynamic Stage Name Resolution
     * If the stageId is generic (eg, 290 for TM Boss), fetch teh current event name
     * (e.g. "Vs Big Mom") to display a proper title in the modal.
     */
    useEffect(()=> {
        if(isOpen){
        setDisplayStageName(stageName);
        
        if(isDynamicStage(stageId)) {
            getEventNames()
                .then(data=> {
                    const trueName = data[stageId];
                    if(trueName) {
                        setDisplayStageName(trueName);
                    }
        
                })
                .catch(err => console.error("Error fetching dynamic stage name:", err));
        }
        }
    }, [isOpen, stageId, stageName]);

    //2. Reset Form on Close
    useEffect(() => {
        if(!isOpen){
                resetForm();
                setIsSubmitting(false);
                verification.resetVerification(false);
            }
    },[isOpen, resetForm, verification]);

// --- HANDLERS ---

    const handleBack =() => {
       if(selectionState.selectedChar){
            setSelectionState(prev=>({...prev, selectedChar: null}));
       } else if (activeStep === 2) {
        setActiveStep(1);
       }else{
            setSelectionState({editingSlot: null, selectedChar: null});
       }
    };

    /**
     * VALIDATION & NAVIGATION
     * Controls the flow between Step 1 (Crew), Step 2 (Guide), Step 3 (Verify)
     */
    const handleNext = () => {
       if(activeStep === 1){
        // Validation: Captain is mandatory
        if(!formData.crewMembers['Captain']){
            toast.error("You must select a Captain before proceeding");
            return;
        }
        setActiveStep(2);
       } else if(activeStep === 2){
        // Validation: Video URL or Text Guide content
        if(formData.guideType === 'video'){
            if(!formData.videoUrl.trim()){
                toast.error("Video URL is required");
                return;
            }

            if(!isValidUrl(formData.videoUrl)){
                toast.error("Please enter a valid URL (starting with http:// or https://)");
                return;
            }

            handleSubmit();
            return;
        }

        if(formData.guideType === 'text'){
            const hasNotes = formData.textGuideData.notes.length>0;
            const hasStages = formData.textGuideData.stages.length >0;
            if(!hasNotes && !hasStages){
                toast.error("Please add at least one note or stage instruction");
                return;
            }
        }
        setActiveStep(3);
       }
    };


    /**
     * FINAL SUBMISSION
     * Constructs the payload and sends it to the server.
     */
    const handleSubmit = async() => {
        const {guideType, crewTitle, videoUrl, textGuideData, crewMembers } = formData;

        if(guideType !== 'video' && !crewTitle.trim()){
            toast.error("Crew Name is required");
            return; 
        }

        if(verification.inputType === 'handle' && verification.socialInput){
            if(!isValidUrl(verification.socialInput)){
                toast.error("Social Link must be a valid URL (http/https)");
                return;
            }
        }

        if(verification.inputType === 'key' && verification.keyInput){
            if(!isValidPublicKey(verification.keyInput)){
                toast.error("Invalid Key Format. It must look like: pub-xxxxxxxx-xxxxxxx");
                return;
            }
        }

        const isVerified = verification.verificationStep === 'confirmed';


        if(guideType === 'text'){
            if(!isVerified && !isNewCreator){
                toast.error("Please complete the creator verification process first.");
                return;
            }
            if(isNewCreator && !verification.manualName.trim()){
                toast.error("Please enter a name for your creator profile");
                return;
            }
        }


        if(isNewCreator){
            try{
                const exists = await verification.checkNameAvailability(verification.manualName);
                 if (exists){
                    toast.error("This name " + verification.manualName + "is already taken.Please use a different name.");
                    return;
                }
        } catch(e) {
            console.error("Name check failed",e);
            toast.error("Could not verify name availability. Please try again");
            return;
        }
    }

        let finalUserName = '';
        if(isVerified) finalUserName = verification.creatorIdentity.name;
        else if(isNewCreator) finalUserName = verification.manualName.trim();
        else finalUserName = guideType === 'video' ? 'Video Submitter' : (verification.manualName || 'Anonymous');

        setIsSubmitting(true);

        try{
            const payload ={
                stage_id: stageId,
                title: guideType === 'video' ? `Video Guide: ${stageName}` : crewTitle,
                user_name: finalUserName,
                crew_data: crewMembers,
                guide_type: guideType,
                video_url: guideType === 'video' ? videoUrl: null,
                text_guide_details: guideType === 'text' ? textGuideData: null,
                creator_url: verification.inputType === 'handle' ? verification.socialInput: null,
                creator_key: verification.inputType === 'key' ? verification.keyInput: null,
                confirmed_creator_id: isVerified ? verification.creatorIdentity.id: null
                
            };

            const data = await submitCrew(payload);

            if(data.success){
                toast.success("Crew submitted sucessfully!");
                setTimeout(()=> {
                    onClose();
                }, 2000);
            }
        } catch(error){
            console.error("Submission failed", error);
            toast.error(error.response?.data?.error || "Failed to submit crew. Please try again");
        } finally {
            setIsSubmitting(false);
        }
    };

        const isSupportSlot = selectionState.editingSlot && (selectionState.editingSlot.includes('Support') || selectionState.editingSlot === 'Support Captain');

        return{
            //State
            activeStep, setActiveStep,
            guideType: formData.guideType, setGuideType: (val)=> updateFormData('guideType', val),
            editingSlot: selectionState.editingSlot,
            selectedChar: selectionState.selectedChar, setSelectedChar: handleCharacterSelect,
            videoUrl: formData.videoUrl, setVideoUrl: (val) => updateFormData('videoUrl', val),
            isSubmitting,
            crewTitle: formData.crewTitle, setCrewTitle: (val)=> updateFormData('crewTitle', val),
            textGuideData: formData.textGuideData, setTextGuideData: (val)=> updateFormData('textGuideData', val),
            crewData: formData.crewMembers,

            displayStageName,
            isSupportSlot,
            verification,

            //Actions
            handleSlotClick,
            handleCharacterSelect,
            handleDetailsConfirm,
            handleBack,
            handleNext,
            handleSubmit
        };
}