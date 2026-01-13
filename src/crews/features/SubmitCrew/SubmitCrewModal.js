import React from "react";
import './SubmitCrewModal.css';
import CharacterSelector from "./CharacterSelector";
import { useCollection } from "../../../context/CollectionContext";
import BaseModal from "../../../components/modals/BaseModal";
import {useSubmitCrew} from "../../hooks/useSubmitCrew";

import CrewSelectionStep from "./steps/CrewSelectionStep";
import GuideDetailsStep from "./steps/GuideDetailsStep";
import VerificationStep from "./steps/VerificationStep";
import CharacterDetailsView from "./CharacterDetailsView";


/**
 * SUBMIT CREW ORCHESTRATOR
 * -------------------------
 * The main container component that manages the multi-step wizard for submitting a new crew startegy.
 * 
 * Architecture:
 * - **Orchestrator:** It doesn't render HTML directly but coordinates child component (`Base Modal`, `Steps`)
 * - **State Management:** Delegated entirely to the `useSubmitCrew` custom hook.
 * - **Dynamic Rendering:** Changes its body content (`children`) and footer button based on the `activeStep`.
 * 
 * @param {Object} props - The component properties
 * @param {boolean} props.isOpen - Controls the visibility of the modal (Conditional Rendering)
 * @param {Function} props.OnClose - Callback to close the modaland reset the state.
 * @param {string} props.stageName - The name of the game stage (for display purposes).
 * @param {number} props.stageId - The unique identifier of the stage (for API submission).
 * 
 * @returns {React.ReactNode} the fully assembled Modal with the active step content. 
 */
function SubmitCrewModal({isOpen, onClose, stageName, stageId}) {
    const {myKeys} = useCollection();
    const {
            activeStep, setActiveStep,
            guideType, setGuideType,
            editingSlot, 
            selectedChar, setSelectedChar,
            videoUrl, setVideoUrl,
            isSubmitting,
            crewTitle, setCrewTitle,
            textGuideData, setTextGuideData,
            crewData, 
            displayStageName,
            isSupportSlot,
            verification,
            handleSlotClick,
            handleCharacterSelect,
            handleDetailsConfirm,
            handleBack,
            handleNext,
            handleSubmit
    } = useSubmitCrew(isOpen, onClose, stageName, stageId, myKeys);

    if(!isOpen) return null;

//--- RENDER HELPERS---
    //1. Title Logic: Decides what text appears in the modal header
    const renderTitle = () => {
        if(editingSlot){
            return selectedChar ? `Configure ${selectedChar.name}` : 'Selected Character';
        }
        return(
            <div className="header-title-group">
                <span className="header-prefix">Strategy:</span>
                <h2 className="header-stage-name">{displayStageName}</h2>
            </div>
        );
    };

    //2. Footer Logic: Complex switch used to determije which buttons to show based on 'activeStep', 'guideType' and 'isSubmitting'
    const renderFooter = () =>{
        if(editingSlot) return null; 

        return(
            <>  
                {/*Conditional Rendering using Nested Ternary Operators */}
                {activeStep === 1 ? (
                        <>
                            <button className="base-btn base-btn-secondary" onClick={onClose}>Cancel</button>
                            <button className="base-btn base-btn-primary" onClick={handleNext}>Next</button>
                        </>

               ):activeStep === 2 ? (
                        <>
                            <button className="base-btn base-btn-secondary" onClick={()=> setActiveStep(1)}>Back</button>
                            <button className="base-btn base-btn-primary" onClick={handleNext}>
                                {guideType === 'video'
                                    ? (isSubmitting ? 'Sending...' : 'Submit')
                                    : 'Next'
                                }</button>
                        </>
               ) : (
                         <>
                            <button className="base-btn base-btn-secondary" onClick={()=> setActiveStep(2)}>Back</button>
                            <button 
                                className="base-btn base-btn-primary" 
                                onClick={handleSubmit} 
                                disabled={
                                    isSubmitting ||
                                    (guideType === 'text' && (
                                        !['confirmed', 'not_found', 'valid_key_no_creator'].includes(verification.verificationStep) ||
                                        ((verification.verificationStep === 'not_found' || verification.verificationStep === 'valid_key_no_creator') &&
                                        !verification.manualName.trim())
                                    ))
                                }
                            >{isSubmitting ? 'Sending...': 'Submit'}
                            </button>
                        </>
                    )}
                </>
        );
    };

    // --- MAIN RENDER --- 
    return(
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={renderTitle()}
                footer={renderFooter()}
                size="large"
                className={editingSlot ? "modal-no-scroll": ""}
            >
                {/* BODY CONTENT */}
                 {editingSlot ? (
                        selectedChar ? (
                            <div className="step-container">
                                <CharacterDetailsView 
                                    character={selectedChar}
                                    isSupport={isSupportSlot}
                                    onConfirm ={handleDetailsConfirm}
                                    onBack={()=> setSelectedChar(null)}
                                />
                            </div>
                        ):(
                            <CharacterSelector 
                                onSelect={handleCharacterSelect}
                                onBack={handleBack}
                            />
                        )
                    ):(
                    activeStep === 1 ? (
                        <CrewSelectionStep
                            crewData={crewData}
                            onSlotClick={handleSlotClick}
                            guideType={guideType}
                            setGuideType={setGuideType}
                        />
                    ): activeStep === 2 ? (
                        <GuideDetailsStep
                            guideType={guideType}
                            videoUrl={videoUrl}
                            setVideoUrl={setVideoUrl}
                            socialInput={verification.socialInput}
                            setSocialInput={verification.setSocialInput}
                            textGuideData={textGuideData}
                            setTextGuideData={setTextGuideData}
                        />
                            ):(
                        <VerificationStep
                                crewTitle={crewTitle}
                                setCrewTitle={setCrewTitle}
                                guideType={guideType}

                                inputType={verification.inputType}
                                setInputType={verification.setInputType}
                                setVerificationStep={verification.setVerificationStep}
                                verificationStep={verification.verificationStep}
                                creatorIdentity={verification.creatorIdentity}
                                socialInput={verification.socialInput}
                                setSocialInput={verification.setSocialInput}
                                keyInput={verification.keyInput}
                                setKeyInput={verification.setKeyInput}
                                manualName={verification.manualName}
                                setManualName={verification.setManualName}

                                //Handlers
                                onVerifyHandle={verification.verifyHandle}
                                onVerifyKey={verification.verifyKey}
                                onAutoFillKey={verification.handleAutoFillKey}
                            />  
                    ))}

            </BaseModal>
        </>
    );
}

export default SubmitCrewModal;
