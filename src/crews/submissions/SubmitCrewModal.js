import React, {useState, useEffect} from "react";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import './SubmitCrewModal.css';
import CharacterSelector from "./CharacterSelector";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];

const LEVELS = ['No', '105', '110', '120', '130', '150'];

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

function SubmitCrewModal({isOpen, onClose, stageName, stageId}) {
    const [activeStep, setActiveStep] = useState(1);
    const [guideType, setGuideType] = useState('video');
    const [editingSlot, setEditingSlot] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [socialUrl, setSocialUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [crewTitle, setCrewTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [textGuideData, setTextGuideData] = useState(INITIAL_TEXT_GUIDE);

    const [crewData, setCrewData] = useState(INITIAL_CREW_DATA);
    
    useEffect(() => {
        if(!isOpen){
            const timer = setTimeout(()=> {
                setCrewData(INITIAL_CREW_DATA);
                setTextGuideData(INITIAL_TEXT_GUIDE);
                setActiveStep(1);
                setEditingSlot(null);
                setSelectedChar(null);
                setGuideType('video');
                setVideoUrl('');
                setCrewTitle('');
                setUserName('');
                setSocialUrl('');
                setIsSubmitting(false);
            },300);
            return ()=> clearTimeout(timer);
        }
    },[isOpen]);
        

    if(!isOpen) return null;


    const handleSlotClick = (slotId) => {
        setEditingSlot(slotId);
        setSelectedChar(null);
    };


    const handleCharacterSelect = (character) => {
        setSelectedChar(character);
    };

    const handleDetailsConfirm = (details) => {
        setCrewData(prev => ({
            ...prev,
            [editingSlot]: {
                ...selectedChar,
                ...details
            }
        }));
        setSelectedChar(null);
        setEditingSlot(null);
    };

    const handleBack =() => {
       if(selectedChar){
        setSelectedChar(null);
       } else if (activeStep === 2) {
        setActiveStep(1);
       }else{
        setEditingSlot(null);
       }
    };

    const handleNext = () => {
        if(activeStep === 1){
            if(!crewData['Captain']){
                toast.error("You must select a Captain before proceeding!");
                return;
            }
            setActiveStep(2);
        } else if (activeStep === 2){
            if(guideType === 'video' && !videoUrl.trim()){
                toast.error("Video URL is required!");
                return;
            }
            if (guideType === 'text'){
                const hasNotes = textGuideData.notes.length >0;
                const hasStages = textGuideData.stages.length >0;
                if(!hasNotes && !hasStages){
                    toast.error("Please add at least one note or stage instruction");
                    return;
                }
            }
            setActiveStep(3);
        }
    };

    const addNote = (text) => {
        if(!text.trim()) return;
        setTextGuideData(prev => ({...prev, notes: [...prev.notes, text]}));
    };

    const updateNote = (index, text) => {
        const newNotes = [...textGuideData.notes];
        newNotes[index] = text;
        setTextGuideData(prev => ({...prev, notes: newNotes}));
    };

    const addStage = (stageName) => {
        if(!stageName.trim()) return;
        setTextGuideData(prev=> ({
            ...prev,
            stages: [...prev.stages, { stage: stageName, instructions: []}]
        }));
    };

    const updateStageName = (index, name) => {
        const newStages = [...textGuideData.stages];
        newStages[index].stage = name;
        setTextGuideData(prev=> ({...prev, stages: newStages}));
    };

    const addInstruction = (stageIndex, text) => {
        if(!text.trim()) return;
        const newStages = [...textGuideData.stages];
        newStages[stageIndex].instructions.push(text);
        setTextGuideData(prev => ({...prev, stages: newStages}));
    };

    const updateInstruction = (stageIndex, instrIndex, text) => {
        const newStages = [...textGuideData.stages];
        newStages[stageIndex].instructions[instrIndex] = text;
        setTextGuideData(prev => ({...prev, stages: newStages}));
    };

    const deleteNote = (index) => {
        setTextGuideData(prev => ({
            ...prev,
            notes: prev.notes.filter((_,i) => i !== index)
        }));
    };

    const deleteStage = (index) => {
        toast((t)=>(
            <div className="toast-confirm-container">
                <span className="toast-message">Delete stage?</span>
                <div className="toast-actions">
                    <button 
                        className="toast-btn confirm"
                        onClick={(e)=> {
                            e.stopPropagation();
                            setTextGuideData(prev=> ({
                            ...prev,
                            stages: prev.stages.filter((_,i) => i !== index)
                        }));
                        toast.dismiss(t.id);
                    }}>Yes </button>
                    <button 
                        
                        className="toast-btn cancel"
                        onClick={(e)=> {
                            e.stopPropagation();
                            toast.dismiss(t.id)
                        }}>No</button>
            </div>
            </div>


        ), {duration: 4000, position: 'top-center', className: 'toast-custom-popup'});
    };

    const deleteInstruction = (stageIndex, instrIndex) =>{
        const newStages = [...textGuideData.stages];
        newStages[stageIndex].instructions = newStages[stageIndex].instructions.filter((_,i) => i !== instrIndex);
        setTextGuideData(prev => ({...prev, stages: newStages}));
    };

    const handleSubmit = async() => {
        if(guideType === 'video' && !videoUrl.trim()){
            toast.error("Video URL is required");
            return;
        }

        if(!crewTitle.trim() || !userName.trim()){
            toast.error("Crew Name and Your name are required");
            return;
        }

        setIsSubmitting(true);

        try{
            const payload ={
                stage_id: stageId,
                title: crewTitle,
                user_name: userName,
                crew_data: crewData,
                social_url: socialUrl,
                guide_type: guideType,
                video_url: guideType === 'video' ? videoUrl: null,
                text_guide_details: guideType === 'text' ? textGuideData: null
            };

            const response = await axios.post(`${BASE_URL}/api/crews/submit`, payload);

            if(response.data.success){
                toast.success("Crew submitted sucessfully!");
                setTimeout(()=> {
                    onClose();
                }, 2000);
            }
        } catch(error){
            console.error("Submission failed", error);
            toast.error("Faied to submit crew. Please try again");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSupportSlot = editingSlot && (editingSlot.includes('Support') || editingSlot === 'Support Captain');

    return(
        <div className="modal-overlay" onClick={onClose}>
            <Toaster
                position="top-center"
                containerStyle={{zIndex: 99999}}
                toastOptions={{
                    className: 'toast-notification',
                    success: { className: 'toast-notification success',},
                    error: { className: 'toast-notification error',}
                }}
            />

            <div className="submit-modal-content" onClick={e=>e.stopPropagation()}>

                {!editingSlot && (
                    <div className="modal-header">
                        <div className="header-title-group">
                            <span className="header-prefix">Strategy:</span>
                            <h2 className="header-stage-name">{stageName}</h2>
                        </div>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                )}

                <div className="modal-body">

                    {editingSlot ? (
                        selectedChar ? (
                            <div className="step-container" style={{height: '100%'}}>
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
                        <div className="step-container">

                            <div className="guide-type-selector">
                                <button
                                    className={`type-btn ${guideType === 'video' ? 'active' : ''}`}
                                    onClick={()=> setGuideType('video')}
                                >Video Guide</button>

                                <button
                                    className={`type-btn ${guideType === 'text' ? 'active' : ''}`}
                                    onClick={()=> setGuideType('text')}
                                >Text guide</button>
                            </div>

                            <div className="submission-grid">
                                {CREW_LAYOUT.map((slot)=> (
                                    <div key={slot.mainId} className="grid-slot-wrapper">
                                        <div 
                                            className="submission-slot main-slot"
                                            onClick={()=> handleSlotClick(slot.mainId)}
                                        > 
                                            {crewData[slot.mainId] ? (
                                                <>
                                                 <img 
                                                    src={`${crewData[slot.mainId].image_url}.png`}
                                                    alt="Selected"
                                                    className="selected-char-img"
                                                />
                                                {crewData[slot.mainId].level && crewData[slot.mainId].level !== 'No' && (
                                                    <div className="level-badge level">Lv.{crewData[slot.mainId].level}</div>    
                                                )}
                                                </>
                                               
                                            ): 
                                                <div className="empty-slot-indicator">+</div>
                                            }

                                    </div>

                                    <div className="mini-label">{slot.label}</div>

                                    {slot.hasSupport && (
                                        <div 
                                            className="submission-slot support-slot"
                                            onClick={()=>handleSlotClick(slot.supportId)}
                                        >
                                            {crewData[slot.supportId] ? (
                                                <>

                                                <img
                                                    src={`${crewData[slot.supportId].image_url}.png`}
                                                    alt="Sup"
                                                    className="selected-char-img"
                                                />
                                                {crewData[slot.supportId].supportType === 'optional' && (
                                                    <div className="optional-indicator">
                                                        !
                                                        <span className="tooltip-text">Optional Support </span>
                                                    </div>
                                                )}
                                                </>
                                            ):(
                                                <div className="empty-slot-indicator small">+</div>
                                            )}
                                        </div>
                                    )}
                                    </div>
                                ))}
                            </div>

                            <p className="hint-text">Click on a slot to select characters. Don't forget supports!</p>
                        </div>
                    ): activeStep === 2 ? (
                        <div className="step-container full-height">

                            {guideType === 'video' ? (
                                <div className="video-input-wrapper">
                                    <div className="input-group">
                                        <label>Video_Url <span style={{color: '#ef4444'}}>*</span></label>
                                        <input
                                            type="text"
                                            className="modal-input glass-input"
                                            placeholder="https://youtube.com/..."
                                            value={videoUrl}
                                            onChange={(e)=> setVideoUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Video Guide Creator (Optional)</label>
                                        <input
                                            type="text"
                                            className="modal-input glass-input"
                                            placeholder="e.g. youtube.com/@{handle}..."
                                            value={socialUrl}
                                            onChange={(e)=>setSocialUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ):(
                                <div className="text-guide-workspace">
                                    <div className="guide-section notes-container">
                                        <div className="section-title">
                                            Strategy Notes 
                                        </div>
                                        {textGuideData.notes.map((note, idx) => (
                                            <EditableInput
                                                key={`note-${idx}`}
                                                value={note}
                                                onSave={(val)=> updateNote(idx, val)}
                                                onDelete={()=> deleteNote(idx)}
                                                placeholder="Enter note..."
                                            />
                                        ))}
                                        <EditableInput
                                            isNew 
                                            onSave={addNote}
                                            placeholder="Add a note(e.g. Ship, Pontential Abilities etc.)"
                                        />
                                    </div>

                                    <div className="stages-wrapper">
                                        {textGuideData.stages.map((stage, sIdx) => (
                                            <div key={`stage-${sIdx}`} className="stage-card">
                                                <div className="stage-card-header">
                                                    <EditableInput 
                                                        value={stage.stage}
                                                        onSave={(val)=> updateStageName(sIdx, val)}
                                                        onDelete={()=> deleteStage(sIdx)}
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
                            )}
                        </div>
                            ):(
                                <div className="step-container center-content">
                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label>Crew Name <span style={{color: '#ef4444'}}>*</span></label>
                                            <input 
                                                type="text"
                                                className="modal-input glass-input"
                                                placeholder="eg. Local Sea Monster (F2P)"
                                                value={crewTitle}
                                                onChange={(e)=> setCrewTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label>Your Name <span style={{color:'#ef4444'}}>*</span></label>
                                            <input
                                                type="text"
                                                className="modal-input glass-input"
                                                placeholder="Nickname"
                                                value={userName}
                                                onChange={(e)=> setUserName(e.target.value)}
                                            />
                                        </div>

                                        <div className="input-group full-width">
                                            <label>Social Media (Optional)</label>
                                            <input 
                                                type="text"
                                                className="modal-input glass-input"
                                                placeholder="Discord ID, Twitter handle, Youtube handle, etc."
                                                value={socialUrl}
                                                onChange={(e)=> setSocialUrl(e.target.value)}
                                            />
                                            <p className="hint-text">
                                                Used for the Fleet Captain Leaderboard verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                    ))}

                {!editingSlot && (
                <div className="modal-footer">
                    {activeStep === 1 ? (
                        <>
                            <button className="cancel-btn" onClick={onClose}>Cancel</button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </>

                    ): activeStep === 2 ? (
                        <>
                            <button className="cancel-btn" onClick={()=> setActiveStep(1)}>Back</button>
                            <button className="next-btn" onClick={handleNext}>Next</button>
                        </>
                    ) : (
                         <>
                            <button className="cancel-btn" onClick={()=> setActiveStep(2)}>Back</button>
                            <button className="next-btn" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Sending...': 'Submit'}</button>
                        </>

                    )}
                </div>
                )}

            </div>
        </div>
    </div>
    )
};

function CharacterDetailsView( {character, isSupport, onConfirm, onBack }){
    const [level, setLevel] = useState('No');
    const [supportType, setSupportType] = useState('mandatory');

    const handleSave = () => {
        if(isSupport){
            onConfirm({supportType});
        } else {
            onConfirm({level});
        }
    };

    return(
        <div className="details-container">
            <h3>Configure {isSupport ? 'Support' : 'Character' }</h3>

            <div className="selected-preview">
                <img src={`${character.image_url}.png`} alt={character.name} />
                <p>{character.name}</p>
            </div>

            <div className="options-wrapper">
                {isSupport ? (
                    <div className="option-group">
                        <label>Support Priority:</label>
                        <div className="pill-selector">
                            <button
                                className={`pill-btn ${supportType === 'mandatory' ? 'active mandatory' : ''}`}
                                onClick={()=> setSupportType('mandatory')}
                            >Mandatory</button>

                            <button
                                className={`pill-btn ${supportType === 'optional' ? 'active optional' : ''}`}
                                onClick={()=> setSupportType('optional')}
                            >Optional(!)</button>
                        </div>
                        <p className="option-desc">
                            {supportType === 'mandatory'
                                ? "Required for the strategy to work"
                                : "Just for stats, can be replaced"
                            }
                        </p>
                    </div>
                ):(
                    <div className="option-group">
                        <label>Level/LLB:</label>  
                        <div className="grid-selector">
                            {LEVELS.map(lv => (
                                <button 
                                    key={lv}
                                    className={`grid-btn ${level === lv ? 'active' : ''}`}
                                    onClick={()=> setLevel(lv)}
                                >{lv === 'No' ? 'No' : `Lv.${lv}`}</button>
                            ))} 
                        </div>
                    </div> 
                )}
            </div>

            <div className="details-actions">
                <button className="back-btn" onClick={onBack}>Back</button>
                <button className="confirm-btn" onClick={handleSave}>Confirm</button>
            </div>
        </div>
    );
}

function EditableInput({value, onSave, onDelete, placeholder, isNew= false, isHeader= false, icon = "+"}){
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    const handleClick = () => {
        setIsEditing(true);
        setTempValue(value || '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter'){
            handleBlur();
        }
    };

    const handleBlur = () => {
        if (tempValue.trim()) {
            onSave(tempValue);
            if (isNew) setTempValue('');
        }
        setIsEditing(false);
    };

    if(isEditing){
        return(
            <input
                autoFocus
                type="text"
                className={`editable-input ${isHeader ? 'header-mode' : ''}`}
                value={tempValue}
                onChange={(e)=> setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder= {placeholder}
            />
        );
    }

    if (isNew){
        return (
            <div className="editable-box placeholder" onClick={handleClick}>
                <span className="plus-icon">{icon}</span>
                <span className="placeholder-text">{placeholder}</span>
            </div>
        );
    }

    return(
        <div 
            className={`editable-box saved ${isHeader ? 'header-mode' : ''}`}
            onClick={handleClick}
            title="Click to edit"
            style={{width: '100%'}}
        >
        <span className="saved-text" style={{flex:1}}>{value}</span>
        {onDelete && (
            <span 
                className="delete-icon-indicator"
                onClick={(e)=> {
                    e.stopPropagation();
                    onDelete();
                }}
                title="Delete"
            >
                <svg 
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </span>
        )}
    </div>
    );
}

export default SubmitCrewModal;