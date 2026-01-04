import React from "react";
import EditableInput from "../../../components/common/EditableInput";
import "./SubmitCrewModal.css";
import toast from "react-hot-toast";
import { useTextGuideState } from "../../hooks/useTextGuideState";

/**
 * TEXT STRATEGY EDITOR (UI)
 * ------------------------
 * A rich UI for building structured text guides.
 * Uses 'EditableInput' components to allow users to click-to-edit any text field.
 * 
 * Structure:
 * - General Notes Section (List of strings)
 * - Stages Section (List of Objects {stage, instructions[]})
 * 
 * Logic: Delegated to 'useTextGuideState' hook.
 */

function TextGuideEditor({ initialData, onSave }){
    // Connect to logic hook
    const {data, actions} = useTextGuideState(initialData, onSave);


    const confirmDeleteStage = (index) => {
        toast((t)=> (
            <div className="toast-confirm-container">
                <span className="toast-message">Delete entire stage?</span>
                <div className="toast-actions">
                    <button className="toast-btn confirm" onClick={()=> {
                        actions.deleteStage(index);
                        toast.dismiss(t.id);
                    }}>Yes</button>
                    <button className="toast-btn cancel" onClick={()=>toast.dismiss(t.id)}>No</button>
                </div>
            </div>
        ), {duration: 4000, position: 'top-center', className: 'toast-custom-popup'});
    }

    return(
        <div className="text-guide-editor-embedded">
            <div className="text-guide-workspace">
                <div className="notes-card">
                    <div className="notes-card-header">
                        <span className="section-title-alt">Strategy Notes</span>
                    </div>
                <div className="notes-card-body">
                    {data.notes.map((note, idx) => (
                        <div key={`note-${idx}`} className="note-row">
                            <span className="note-bullet">•</span>    
                            <EditableInput
                                key={`note-${idx}`}
                                value={note}
                                onSave={(val)=> actions.updateNote(idx, val)}
                                onDelete={()=> actions.deleteNote(idx)}
                                placeholder="Enter note..."
                            />
                        </div>
                 ))}

                 <div className="note-row new-note">
                    <span className="note-bullet">•</span>
                    <EditableInput
                    isNew 
                    onSave={actions.addNote}
                    placeholder="Add a note(e.g. Ship, Potential Abilities etc.)"
                    />

                 </div>
                
                </div>
                </div>
                </div>
                
                <div className="stages-wrapper">
                {data.stages.map((stage, sIdx) => (
                <div key={`stage-${sIdx}`} className="stage-card">
                <div className="stage-card-header">
                    <EditableInput 
                        value={stage.stage}
                        onSave={(val)=> {actions.updateStageName(sIdx, val)}}
                        onDelete={()=>{ confirmDeleteStage(sIdx)}}
                        isHeader
                    />
                </div>
                <div className="stage-card-body">
                {stage.instructions.map((instr, iIdx)=> (
                <div key={`instr-${sIdx}-${iIdx}`} className="instruction-row">
                <span className="step-number">{iIdx+1}.</span>
                    <EditableInput
                        value={instr}
                        onSave={(val)=> actions.updateInstruction(sIdx, iIdx, val)}
                        onDelete={()=> actions.deleteInstruction(sIdx, iIdx)}
                        placeholder="Describe the action..."
                    />
                </div> 
                ))}
                <div className="instruction-row new">
                    <span className="step-number">•</span>
                        <EditableInput
                            isNew
                            onSave={(val) => actions.addInstruction(sIdx, val)}
                            placeholder="Add step..."
                        />
                </div>
                </div>
                </div>
                ))}
                                                        
                <div className="add-stage-btn-wrapper">
                    <EditableInput
                        isNew
                        onSave={actions.addStage}
                        placeholder="+ Add New Stage"
                        icon=""
                    />
                </div>
                </div>
        </div>
    );
}

export default TextGuideEditor;