import React, {useState, useEffect} from "react";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import './SubmitCrewModal.css';
import CharacterSelector from "./CharacterSelector";
import { useCollection } from "../../CollectionContext";
import TextGuideEditor from "./TextGuideEditor";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [crewTitle, setCrewTitle] = useState('');
    const [textGuideData, setTextGuideData] = useState(INITIAL_TEXT_GUIDE);
    const [crewData, setCrewData] = useState(INITIAL_CREW_DATA);
    const {myKeys} = useCollection();
    const [verificationStep, setVerificationStep] = useState('idle'); //'idle', 'checking', 'found', 'not_found', 'valid_key_no_creator', 'confirmed'
    const [creatorIdentity, setCreatorIdentity] = useState(null);
    const [manualName, setManualName] = useState('');
    const [inputType, setInputType] = useState('handle');
    const [socialInput, setSocialInput] = useState('');
    const [keyInput, setKeyInput] = useState('');
    const isNewCreator = verificationStep === 'not_found' || verificationStep === 'valid_key_no_creator';
    
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
                setIsSubmitting(false);
                setVerificationStep('idle');
                setCreatorIdentity(null);
                setManualName('');
                setSocialInput('');
                setKeyInput('');
                setInputType('handle');
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
            
            if( guideType === 'video'){
                handleSubmit();
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



    const handleSubmit = async() => {

        if(guideType !== 'video' && !crewTitle.trim()){
            toast.error("Crew Name is required");
            return; 
        }

        const isVerified = verificationStep === 'confirmed';
        const isNew = verificationStep === 'not_found' || verificationStep === 'valid_key_no_creator';


        if(guideType === 'text'){
            if(!isVerified && !isNew){
                toast.error("Please complete the creator verification process first.");
                return;
            }
            if(isNew && !manualName.trim()){
                toast.error("Please enter a name for your creator profile");
                return;
            }
        }


        if(isNew){
            try{
                const checkRes = await axios.get(`${BASE_URL}/api/creators/check-name/${encodeURIComponent(manualName.trim())}`);
                 if (checkRes.data.exists){
                toast.error("This name " + manualName + "is already taken.Please use a different name.");
                return;
            }
        } catch(e) {
            console.error("Name check failed",e);
            toast.error("Could not verify name availability. Please try again");
            return;
        }
    }

        let finalUserName = '';
        if(isVerified) finalUserName = creatorIdentity.name;
        else if(isNew) finalUserName = manualName.trim();
        else finalUserName = guideType === 'video' ? 'Video Submitter' : (manualName || 'Anonymous');

        setIsSubmitting(true);

        try{
            const payload ={
                stage_id: stageId,
                title: guideType === 'video' ? `Video Guide: ${stageName}` : crewTitle,
                user_name: finalUserName,
                crew_data: crewData,
                guide_type: guideType,
                video_url: guideType === 'video' ? videoUrl: null,
                text_guide_details: guideType === 'text' ? textGuideData: null,
                creator_url: inputType === 'handle' ? socialInput: null,
                creator_key: inputType === 'key' ? keyInput: null,
                confirmed_creator_id: isVerified ? creatorIdentity.id: null
                
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

    const verifyHandle = async() => {
        if(!socialInput.trim()) return;
        setVerificationStep('checking');
        try{
            const res = await axios.post(`${BASE_URL}/api/creators/verify-handle`, {social_url: socialInput});
            if(res.data.status === 'FOUND'){
                setCreatorIdentity(res.data.creator);
                setVerificationStep('found');
            } else {
                setVerificationStep('not_found');
            }
        } catch(err){
            console.error(err);
            toast.error("Verification failed");
            setVerificationStep('idle');
        }
    };

    const verifyKey = async () => {
        if(!keyInput.trim()) return;
        setVerificationStep('checking');
        try{
            const res = await axios.post(`${BASE_URL}/api/creators/verify-key`, {public_key: keyInput});
            if(res.data.status === 'CREATOR_FOUND'){
                setCreatorIdentity(res.data.creator);
                setVerificationStep('found');
            } else if(res.data.status === 'VALID_KEY_NO_CREATOR'){
                setVerificationStep('valid_key_no_creator');
            } else {
                toast.error("Invalid Public Key. This key does not exist in our database");
                setVerificationStep('idle');
            }
        } catch(err){
            console.error(err);
            toast.error("Verification failed");
            setVerificationStep('idle');
        }
    };

    const handleAutoFillKey = () => {
        if(myKeys?.publicKey){
            setKeyInput(myKeys.publicKey);
        } else {
            toast.error("No Public Key found in your browser storage");
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
                        <div className="step-container">

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
                                            value={socialInput}
                                            onChange={(e)=>setSocialInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ):(
                               
                                <TextGuideEditor 
                                    initialData={textGuideData}
                                    onSave={(newData) => setTextGuideData(newData)}
                                />
                            )}
                        </div>
                            ):(
                                <div className="step-container">
                                    <div className="form-grid verification-mode">
                                        <div className="input-group full-width">
                                            <label>Crew Name <span style={{color: '#ef4444'}}>*</span></label>
                                            <input 
                                                type="text"
                                                className="modal-input glass-input"
                                                placeholder="eg. Local Sea Monster (F2P)"
                                                value={crewTitle}
                                                onChange={(e)=> setCrewTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="section-divider full-width">
                                            <span>Creator Verification</span>
                                        </div>

                                        <div className="verification-tabs full-width">
                                            <button 
                                                className={`tab-btn ${inputType === 'handle' ? 'active' : ''}`}
                                                onClick={()=> {setInputType('handle'); setVerificationStep('idle'); }}
                                            >Link Social Handle
                                            </button>
                                            {guideType === 'text' && (
                                                <button 
                                                    className={`tab-btn ${inputType === 'key' ? 'active' : ''}`}
                                                    onClick={()=> {setInputType('key'); setVerificationStep('idle');}}
                                                >Use Box Public Key
                                                </button>
                                            )}
                                </div>

                                <div className="verification-input-area full-width">
                                    {verificationStep === 'confirmed' ? (
                                        <div className="verified-badge">
                                            <div className="badge-content">
                                                <span className="check-icon">✓</span>
                                                <div className="badge-info">
                                                    <span className="label">verified Creator</span>
                                                    <span className="name">{creatorIdentity.name}</span>
                                                </div>
                                            </div>
                                            <button className="change-btn" onClick={()=> setVerificationStep('idle')}>Change</button>
                                        </div>

                                    ):(
                                        <div className="search-box-wrapper">
                                            {inputType === 'handle' ? (
                                                <div className="input-group full-width">
                                                    <label>Social Handle /URL</label>
                                                <input 
                                                    type="text"
                                                    className="modal-input glass-input"
                                                    placeholder="Youtube/Twitter/Discord Url or Handle..."
                                                    value={socialInput}
                                                    onChange={(e)=> setSocialInput(e.target.value)}
                                                />
                                                </div>
                                            ): (
                                                <div className="input-group full-width">
                                                    <label>Box Public Key</label>
                                                    <div className="key-input-group">
                                                    <input 
                                                        type="text"
                                                        className="modal-input glass-input"
                                                        placeholder="Enter Public Key"
                                                        value={keyInput}
                                                        onChange={(e)=> setKeyInput(e.target.value)}
                                                    />
                                                    <button className="paste-key-btn" onClick={handleAutoFillKey} title="Use My Key">Paste My Key</button>
                                                </div>
                                            </div>
                                                
                                            )}

                                            <button 
                                                className="verify-action-btn"
                                                onClick={inputType === 'handle' ? verifyHandle : verifyKey}
                                                disabled={inputType === 'handle' ? !socialInput : !keyInput}
                                            >
                                                Verify    
                                            </button>
                                        </div>
                                    )}
                                </div>
                            {verificationStep === 'found' && (
                               <div className="verification-result full-width">
                                <p className="verification-prompt">Is this you?</p>

                                <div className="creator-card-mini modern-card">
                                    <div className="creator-avatar-placeholder">
                                        {creatorIdentity.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="creator-info-block">
                                        <span className="creator-name-large">{creatorIdentity.name}</span>
                                        <span className="creator-id-display">ID: {creatorIdentity.id}</span>
                                    </div>
                                </div>

                                <div className="verification-actions">
                                    <button className="confirm-btn-small modern" onClick={()=> setVerificationStep('confirmed')}>Yes, it's me</button>
                                    <button className="reject-btn-small modern" onClick={()=>setVerificationStep('idle')}>No</button>
                                </div>
                            </div>
                            )}

                            {(verificationStep === 'not_found' || verificationStep === 'valid_key_no_creator') && (
                                <div className="manual-name-input full-width fade-in">
                                    <div className="alert-box info">
                                        {verificationStep === 'not_found'
                                            ? "Creator not found. Enter your name to create a new profile."
                                            : "Valid Key found! Enter your name to create your Creator Profile"
                                        }
                                        </div>
                                        <label>Your Name <span style={{color: '#ef4444'}}>*</span></label>
                                        <input 
                                            type="text"
                                            className="modal-input glass-input"
                                            placeholder="Enter your nickname..."
                                            value={manualName}
                                            onChange={(e)=> setManualName(e.target.value)}
                                        />
                                    </div>
                            )}

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
                            <button className="next-btn" onClick={handleNext}>
                                {guideType === 'video'
                                    ? (isSubmitting ? 'Sending...' : 'Submit')
                                    : 'Next'
                                }</button>
                        </>
                    ) : (
                         <>
                            <button className="cancel-btn" onClick={()=> setActiveStep(2)}>Back</button>
                            <button 
                                className="next-btn" 
                                onClick={handleSubmit} 
                                disabled={
                                    isSubmitting ||
                                    (guideType === 'text' && (
                                        !['confirmed', 'not_found', 'valid_key_no_creator'].includes(verificationStep) ||
                                        ((verificationStep === 'not_found' || verificationStep === 'valid_key_no_creator') &&
                                        !manualName.trim())
                                    ))
                                }
                            >{isSubmitting ? 'Sending...': 'Submit'}
                            </button>
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

export default SubmitCrewModal;