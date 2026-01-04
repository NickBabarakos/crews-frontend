import { useState, useEffect } from "react";

/**
 * EDITOR STATE MANAGER (CRUD Logic)
 * --------------------------------
 * Manages the nested JSON structure of a Text Guide.
 * Provides helper actions (addNote, deleteStage, etc.) to keep the UI component clean.
 * 
 * Data Structure:
 * {
 *  notes: ["...", "..."]
 *  stages: [{stage: "Stage 1", instructions: ["..."]}]
 * }
 */

export const useTextGuideState = (initialData, onSave) => {
    const [data, setData] = useState(initialData || {notes: [], stages: []});
    
    //Sync with parent form whenever local state changes
    useEffect(()=> {
        onSave(data);
    }, [data, onSave]);

    const actions = {
        addNote: (text) =>{
            if(!text.trim()) return;
            setData(prev=> ({...prev, notes: [...prev.notes, text]}));
        },
        deleteNote: (index) => {
            setData(prev => ({...prev, notes: prev.notes.filter((_,i)=> i !== index)}));
        },
        updateNote: (index, text) => {
            const newNotes = [...data.notes];
            newNotes[index] = text;
            setData(prev => ({...prev, notes: newNotes}));
        },
        addStage: (stageName) => {
            setData(prev => ({
                ...prev,
                stages: [...prev.stages, {stage: stageName, instructions: []}]
        }));
        },
        deleteStage: (index) => {
            setData(prev => ({...prev, stages: prev.stages.filter((_,i)=> i !== index )}));
        },
        updateStageName: (index, val) => {
            const newStages = [...data.stages];
            newStages[index].stage = val;
            setData(prev => ({...prev, stages: newStages}));
        },
        addInstruction: (stageIndex, text)=>{
            const newStages = [...data.stages];
            newStages[stageIndex].instructions.push(text);
            setData(prev=> ({...prev, stages: newStages}));
        }, 
        updateInstruction: (stageIndex, instrIndex, text)=> {
            const newStages = [...data.stages];
            newStages[stageIndex].instructions[instrIndex] = text;
            setData(prev => ({...prev, stages: newStages}));
        },
        deleteInstruction: (stageIndex, instrIndex) => {
            const newStages = [...data.stages];
            newStages[stageIndex].instructions = newStages[stageIndex].instructions.filter((_,i) => i !== instrIndex);
            setData(prev => ({...prev, stages: newStages}));
        }

    };

        return {data, actions};
};