import React, {useState, useEffect } from "react";
import EditableInput from "./EditableInput";
import './SubmitCrewModal.css';
import toast from "react-hot-toast";

function TextGuideEditor({ initialData, onSave }){
    const [data, setData] = useState(initialData || {notes: [], stages: []});
    
    useEffect(()=> {
        onSave(data);
    }, [data, onSave]);

    const updateAll = (newData) => {
        setData(newData);
        onSave(newData);
    };

    const addNote = (text) => {
        if(!text.trim()) return;
        setData(prev => ({...prev, notes: [...prev.notes, text]}));
    };

    const deleteNote = (index) => {
        setData(prev => ({...prev, notes: prev.notes.filter((_,i)=> i !== index)}));
    };

    const updateNote = (index, text) => {
        const newNotes = [...data.notes];
        newNotes[index] = text;
        setData(prev => ({...prev, notes: newNotes}));
    };

    const addStage = (stageName) => {
        setData(prev => ({
            ...prev,
            stages: [...prev.stages, {stage: stageName, instructions: []}]
        }));
    };

    const addInstruction = (stageIndex, text) => {
        const newStages = [...data.stages];
        newStages[stageIndex].instructions.push(text);
        setData(prev=> ({...prev, stages: newStages}));
    };

    const updateInstruction = (stageIndex, instrIndex, text) => {
        const newStages = [...data.stages];
        newStages[stageIndex].instructions[instrIndex] = text;
        setData(prev => ({...prev, stages: newStages}));
    };

    const deleteInstruction = (stageIndex, instrIndex) => {
        const newStages = [...data.stages];
        newStages[stageIndex].instructions = newStages[stageIndex].instructions.filter((_,i) => i !== instrIndex);
        setData(prev => ({...prev, stages: newStages}));
    };

    const deleteNotification = (index) => {
        toast((t)=> (
            <div className="toast-confirm-container">
                <span className="toast-message">Delete entire stage?</span>
                <div className="toast-actions">
                    <button className="toast-btn confirm" onClick={()=> {
                        setData(prev => ({...prev, stages: prev.stages.filter((_,i)=> i !== index )}));
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
                                onSave={(val)=> updateNote(idx, val)}
                                onDelete={()=> deleteNote(idx)}
                                placeholder="Enter note..."
                            />
                        </div>
                 ))}

                 <div className="note-row new-note">
                    <span className="note-bullet">•</span>
                    <EditableInput
                    isNew 
                    onSave={addNote}
                    placeholder="Add a note(e.g. Ship, Pontential Abilities etc.)"
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
                        onSave={(val)=> { 
                            const newStages = [...data.stages];
                            newStages[sIdx].stage = val;
                            setData(prev => ({...prev, stages: newStages}));
                        }}
                        onDelete={()=>{ deleteNotification(sIdx)}}
                        isHeader
                    />
                </div>
                <div className="stage-card-body">
                {stage.instructions.map((instr, iIdx)=> (
                <div key={`instr-${sIdx}-${iIdx}`} className="instruction-row">
                <span className="step-number">{iIdx+1}.</span>
                    <EditableInput
                        value={instr}
                        onSave={(val)=> updateInstruction(sIdx, iIdx, val)}
                        onDelete={()=> deleteInstruction(sIdx, iIdx)}
                        placeholder="Describe the action..."
                    />
                </div> 
                ))}
                <div className="instruction-row new">
                    <span className="step-number">•</span>
                        <EditableInput
                            isNew
                            onSave={(val) => addInstruction(sIdx, val)}
                            placeholder="Add step..."
                        />
                </div>
                </div>
                </div>
                ))}
                                                        
                <div className="add-stage-btn-wrapper">
                    <EditableInput
                        isNew
                        onSave={addStage}
                        placeholder="+ Add New Stage"
                        icon=""
                    />
                </div>
                </div>
        </div>
    );
}

export default TextGuideEditor;