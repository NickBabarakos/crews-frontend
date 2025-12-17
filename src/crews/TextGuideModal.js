import React from 'react';
import './TextGuideModal.css';

function TextGuideModal({isOpen, onClose, crewData}){
    if(!isOpen || !crewData) return null;

    const {title, creator_name, text_guide} = crewData;

    let parsedGuide = {};
    try{
        parsedGuide = (typeof text_guide === 'string' ? JSON.parse(text_guide) : text_guide);
    } catch(e){
        console.error("Error parsing text_guide JSON:",e);
    }
    const notes = parsedGuide?.notes || [];
    const stages = parsedGuide?.stages || [];

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content text-guide-modal" onClick={(e)=> e.stopPropagation()}>

                <div className="modal-header">
                    <div className="header-info">
                        <span className="strategy-label">STRATEGY GUIDE</span>
                        <h2 className="crew-title">{title || "Unknown Strategy"}</h2>

                        <div className="creator-badge">
                            <span className="by-text">Creator:</span>
                            <span className="creator-name">{creator_name || "Uknown"}</span>
                        </div>
                    </div>
                <button className="close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div className="modal-body custom-scrollbar">
                {notes.length > 0 && (
                    <div className="guide-section notes-section" style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="section-header notes-header">
                            <svg className="section-icon" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
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
            <p>No writtern strategy availabe for this crew</p>
        </div>
    )}
</div>
</div>
</div>
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

