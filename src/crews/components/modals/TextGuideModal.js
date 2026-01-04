import React from 'react';
import BaseModal from '../../../components/modals/BaseModal';
import './TextGuideModal.css';
import { SelectionIcon } from '../../../components/Icons';

/**
 * TEXT STRATEGY VIEWER
 * --------------------
 * Renders a structured text guide submitted by a user.
 * 
 * Data Structure expected:
 * {
 *  notes: ["Ship: Moby Dick", ...],
 *  stages: [
 *      { stage1, instructions: ["Tap with Luffy", "Use Law Special"]},
 *      ...
 *  ]
 * }
 */

function TextGuideModal({isOpen, onClose, crewData}){
    if(!isOpen || !crewData) return null;

    const {title, creator_name, text_guide} = crewData;

    // Safe Parsing of stored JSON string
    let parsedGuide = {};
    try{
        parsedGuide = (typeof text_guide === 'string' ? JSON.parse(text_guide) : text_guide);
    } catch(e){
        console.error("Error parsing text_guide JSON:",e);
    }
    const notes = parsedGuide?.notes || [];
    const stages = parsedGuide?.stages || [];

    const modalHeaderTitle = (
        <div className="header-info">
            <span className="strategy-label">STRATEGY GUIDE</span>
                <div className="text-guide-header-group">
                    <h2 className="text-guide-main-title">{title || "Unknown Strategy"}</h2>

                        <div className="text-guide-creator-wrapper">
                            <span className="by-text">Creator:</span>
                            <span className="text-guide-creator-name">{creator_name || "Uknown"}</span>
                        </div>
                    </div>
                </div>
    );

    return(
        <BaseModal 
            isOpen={isOpen}
            onClose={onClose}
            title={modalHeaderTitle}
            size="large"
            className="text-guide-modal"
        >
        <div className="text-guide-content">
            {notes.length > 0 && (
                <div className="guide-section notes-section" style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="section-header notes-header">
                        <SelectionIcon className="selection-icon"/>
                        <span>Notes</span>
                    </div>
           
            <ul className="notes-list">
                {notes.map((note, index) => (
                    <li key={`note-${index}`}>
                        <span className="note-bullet">•</span>
                        {String(note)}
                    </li>
                ))}
            </ul>
        </div>
    )}

    <div className="stages-container">
        {stages.map((stageData, index)=> (
            <div key={`stage-${index}`} className="guide-section stage-card">
                <div className="stage-header">
                    <span className="stage-number">{stageData.stage || (index+1)}</span>
                </div>

                <div className="stage-content">
                    {stageData.instructions && stageData.instructions.map((instruction, idx) => (
                        <div key={`instr-${index}-${idx}`} className="step-row">
                            <div className="step-indicator">
                                <span className="step-label">STEP</span>
                                <span className="step-num">{idx +1}</span>
                            </div>
                            <p className="step-text">{instruction}</p>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>

    {notes.length === 0 && stages.length === 0 && (
        <div className="empty-state">
            <p>No written strategy availabe for this crew</p>
        </div>
    )}

    </div>
        </BaseModal>
   );         
}

export default TextGuideModal;





/* Μορφη guideData 
    {
        "notes": ["Note1", "Note2",...].
        "stages": [
            { "stage": 1, "instructions": ["Do this", "Do that", ...] },
            { "stage": 2, "instructions": [....]},
             ...
        ]
    }
*/

