import React, {useRef} from "react";
import BaseModal from "../components/modals/BaseModal";
import './TeamBuilderModal.css';

import {useTeamBuilder} from "./hooks/useTeamBuilder";
import {useTeamExport} from "./hooks/useTeamExport";

//Sub-components
import QuantitySelection from "./components/teamBuilder/QuantitySelection";
import TeamEditor from "./components/teamBuilder/TeamEditor";
import ExportPreview from "./components/teamBuilder/ExportPreview";

import CharacterSelector from "../crews/features/SubmitCrew/CharacterSelector";
import CharacterDetailsView from "../crews/features/SubmitCrew/CharacterDetailsView";

/**
 * COMPONENT: Team Builder Orchestrator
 * -----------------------------------
 * Manages the UI State for team creation.
 * Acts as a "Traffic Controller" between the different steps (Step 1, Step 2, Export)
 * 
 * FLOW DIAGRAM(Mermaid):
 * ----------------------
 * ```
 * mermaid
 * graph TD
 *  A[Open Modal] --> B{Step 1: Quantity}
 *  B --> |Select Count| C[Step 2: Team Editor Grid]
 *  C --> |Click Slot | D[Character Selector View]
 *  D --> |Select Char| E[Character Details/Support View]
 *  E --> |Confirm| C
 *  E --> |Back| D
 *  D --> |Back| C
 *  C --> |Next Team| C
 *  C --> |Last Team & Export| F[Trigger Export Process]
 *  F --> G[Close Modal]
 * ```
 */
function TeamBuilderModal({isOpen, onClose}){
    //1. Logic Hooks
    const {state, actions} = useTeamBuilder(isOpen);
    const exportRef = useRef(null);
    const {isExporting, triggerExport} = useTeamExport(exportRef);

    //2. Handlers
    const handleNext = async ()=>{
        const result = actions.goToNextTeam();

        if(result.action === 'READY_TO_EXPORT'){
            const success = await triggerExport();
            if(success){
                onClose();
            }
        }
    };

    //3. Dynamic Title Calculation
    const getModalTitle = () =>{
        if(state.step === 1) return 'Team Builder - Select Quantity';
        if (state.editingSlot) return 'Select Character';
        return `Editing Team ${state.currentTeamIndex +1} of ${state.teamCount}`;
    };


    //4. Footer Rendering Logic
    const renderFooter = () => {
        //Show footer only in Editor Step (Step 2) AND when not selecting a character
        if(state.step === 2 && !state.editingSlot){
            const isLastTeam = state.currentTeamIndex === state.teamCount-1;
            
            return(
                <>
                    <button className="base-btn base-btn-secondary" onClick={actions.goBack}>
                        {state.currentTeamIndex === 0 ? 'Back' : 'Previous'}
                    </button>
                    <button className="base-btn base-btn-primary" onClick={handleNext} disabled={isExporting}>
                        {isExporting ? 'Exporting...' : (isLastTeam ? 'Export Image' : 'Next Team')}
                    </button>
                </>
            );
        }
        return null;
    };

    //5. Main Content Switching Logic
    /**
     * Decides which Component to render based on the State Machine.
     * Render Priority:
     * 1. Quantity Section (Step 1)
     * 2. Character Details (If a character is selected for a slot)
     * 3. Character Selector (If a slot is open but no character is selected)
     * 4. Team Editor Grid (Default View for Step 2)
     */
    const renderContent = () => {
        if(state.step === 1) {
            return <QuantitySelection onSelect={actions.initializeTeams} />;
        }

        //Step 2: Editor Flow
        if(state.editingSlot){
            //Sub-Flow: Character Selection
            if(state.selectedChar){
                return(
                    <div className="step-container">
                        <CharacterDetailsView
                            character={state.selectedChar}
                            isSupport={state.editingSlot.includes('Support') || state.editingSlot === 'Support Captain'}
                            onConfirm={actions.confirmCharacterDetails}
                            onBack={()=> actions.selectCharacter(null)} //Clear selection to go back to grid
                        />
                    </div>
                );
            }
            return(
                <CharacterSelector
                    onSelect={actions.selectCharacter}
                    onBack={actions.goBack}
                />
            );
        }

        //Default Editor View
        return(
            <TeamEditor
                team={state.currentTeam}
                onTitleChange={actions.updatedTeamTitle}
                onSlotClick={actions.openSlot}
            />
        );
    };

    if(!isOpen) return null;

    return(
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={getModalTitle()}
                size="large"
                footer={renderFooter()}
            >
                {renderContent()}
            </BaseModal>

            {/*Hidden Export Component- Always rendered but hidden via CSS/Styles in the component itself*/}
            <ExportPreview
                ref={exportRef}
                teams={state.teams}
                teamCount={state.teamCount}
            />
        </>
    )
}

export default TeamBuilderModal;

 