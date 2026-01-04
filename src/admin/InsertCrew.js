import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Admin.css';
import TextGuideEditor from '../crews/features/SubmitCrew/TextGuideEditor';
import TextGuideModal from '../crews/components/modals/TextGuideModal';
import CharacterSelector from '../crews/features/SubmitCrew/CharacterSelector';
import CharacterDetailsView from '../crews/features/SubmitCrew/CharacterDetailsView';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];


function InsertCrew({ adminSecret, prefilledData = null, onCancel=null, onApproveSuccess = null }) {
    const [guideType, setGuideType ] = useState('video');
    const [formData, setFormData] = useState({
        title: '',
        stage_id: '',
        video_url: '',
        text_guide_json: ''
    });

    const [creatorStatus, setCreatorStatus] = useState({
        inputType: 'url', // 'url' or 'key'
        urlInput: '',
        step: 'search',
        data: null,
        tempName: ''
    });

    const [members, setMembers] = useState({});
    const [editingSlot, setEditingSlot] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isVisualEditorOpen, setIsVisualEditorOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleCheckCreator = async ()=> {
        if(!creatorStatus.urlInput) return alert("Please enter a value");

        try{
            const payload = creatorStatus.inputType === 'key'
                ? {public_key: creatorStatus.urlInput}
                : {social_url: creatorStatus.urlInput};

            const res = await axios.post(
                `${BASE_URL}/api/admin/check-creator`,
                payload,
                { headers: { 'x-admin-secret': adminSecret }}
            );

            if(res.data.exists){
                setCreatorStatus(prev => ({
                    ...prev,
                    step: 'verified',
                    data: res.data.creator 
                })); 
            } else {
                setCreatorStatus(prev => ({
                    ...prev,
                    step: 'not_found',
                    data: null
                }));
            }
        } catch(err){
            alert("Error checking creator" + err.message);
        }
    };

    const handleCreateCreator = async () => {
        if(!creatorStatus.tempName) return alert("Please enter a name");

        try{
            const payload ={
                name: creatorStatus.tempName,
                social_url: creatorStatus.inputType === 'url' ? creatorStatus.urlInput: null,
                public_key: creatorStatus.inputType === 'key' ? creatorStatus.urlInput: null
            };

            const res = await axios.post(
                `${BASE_URL}/api/admin/create-creator`,
                payload,
                {headers: {'x-admin-secret': adminSecret}}
            );

            if(res.data.success){
                setCreatorStatus(prev => ({
                    ...prev,
                    step: 'verified',
                    data: res.data.creator 
                }));
            }
        } catch (err){
            alert("Error creating creator: " + err.message );
        }
    };

    const handleCancelCreator = ()=> {
        setCreatorStatus({
            urlInput: '',
            step: 'search',
            data: null,
            tempName: ''
        });
    };


    const handleSlotClick = (slotId) => {
        setEditingSlot(slotId);
        setSelectedChar(null);
    };

    const handleSubmit = async() => {
        if(!formData.title || !formData.stage_id){
            return alert("Title and Stage ID are required");
        }

        if(!creatorStatus.data || !creatorStatus.data.id){
            return alert("Please select/verify a creator first");
        }

        let finalVideoUrl = null;
        let finalTextGuide = null;

        if(guideType === 'video'){
            if(!formData.video_url) return alert("Video URL is required for Video Guides");
            finalVideoUrl = formData.video_url;
        } else{
            if(!formData.text_guide_json) return alert("JSON content is required for Text Guides");
            try{
                finalTextGuide = JSON.parse(formData.text_guide_json);
            } catch(e){
                return alert("Invalid JSON format! Please check your syntax");
            }
        }

        const membersArray = [];

        Object.entries(members).forEach(([pos, data]) => {
            if(data && data.id){
                let notes = null;

                if(pos.toLowerCase().includes('support')){
                    notes = data.supportType === 'optional' ? 'optional' : null;
                } else {
                    notes = (data.level && data.level !== 'No') ? data.level: null;
                }

                membersArray.push({
                    position: pos,
                    character_id: parseInt(data.id),
                    notes: notes
                });
            }
        });

        setIsSubmitting(true);
        try{
            const payload = {
                title: formData.title,
                stage_id: parseInt(formData.stage_id),
                creator_id: creatorStatus.data.id,
                guide_type: guideType,
                video_url: finalVideoUrl,
                text_guide: finalTextGuide,
                members: membersArray
            };

            const res = await axios.post(
                `${BASE_URL}/api/admin/create-crew`,
                payload,
                { headers: {'x-admin-secret': adminSecret}}
            );

            if(res.data.success){
                alert(`SUCCESS! Crew created with ID: ${res.data.crewId}`);
                if (prefilledData && onApproveSuccess){
                    onApproveSuccess(prefilledData.id);
                } else {
                    handleResetForm();
                }
            }
        } catch(err){
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message;
            const errorDetail = err.response?.data?.details || 'Check console for more info';
            alert(`FAILED: ${errorMsg}\n\nREASON: ${errorDetail}`);
        } finally{
            setIsSubmitting(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            title: '',
            stage_id: '',
            video_url: '',
            text_guide_json: ''
        });
        setCreatorStatus({
            urlInput: '',
            step: 'search',
            data: null,
            tempName: ''
        });
        setMembers({});
        setGuideType('video');
    };

    useEffect(()=> {
        if (prefilledData){
            const initalTitle = prefilledData.title && prefilledData.title.trim() !== ''
                ? prefilledData.title
                : `${prefilledData.user_name}'s Strategy`;

            setFormData({
                title: initalTitle,
                stage_id: prefilledData.stage_id,
                video_url: prefilledData.video_url || '',
                text_guide_json: prefilledData.text_guide_details ? JSON.stringify(prefilledData.text_guide_details, null, 2) : ''
            });

            setGuideType(prefilledData.guide_type);

            const keyToUse = prefilledData.creator_key;
            const urlToUse = prefilledData.creator_url || prefilledData.social_url || prefilledData.user_social_url || '';

            if(keyToUse){
                setCreatorStatus(prev => ({
                    ...prev,
                    inputType: 'key',
                    urlInput: keyToUse,
                    step: 'search',
                    tempName: prefilledData.user_name
                }));
            } else if(urlToUse){
                setCreatorStatus(prev => ({
                    ...prev,
                    inputType: 'url',
                    urlInput: urlToUse,
                    step: 'search',
                    tempName: prefilledData.guide_type === 'text' ? prefilledData.user_name : ''
                }));
            }
    

            if(prefilledData.crew_data){
                const mappedMembers = {};
                Object.entries(prefilledData.crew_data).forEach(([pos,data]) => {
                    if(data && data.id){
                        let notes =null;
                        
                        if(pos.toLowerCase().includes('support')){
                            if(data.supportType === 'optional'){
                                notes = 'optional';
                            }
                        } else {
                            if(data.level && data.level !== 'No'){
                                notes = data.level;
                            }
                        }

                        mappedMembers[pos] = {
                            ...data,
                            character_id: data.id,
                            notes: notes
                        };
                    }
                });
                setMembers(mappedMembers);
            }
        }

    }, [prefilledData]);

    const handleReject = async () => {
        if(!window.confirm("Are you sure you want to REJECT and DELETE this pending crew?")) return;

        try{
            await axios.delete(`${BASE_URL}/api/admin/pending-crews/${prefilledData.id}`, {
                headers: {'x-admin-secret': adminSecret}
            });
            onApproveSuccess(null);
        } catch (err){
            alert("Error rejecting crew");
        }
    };


    return(
        <div className="insert-crew-container">
            {prefilledData && (
                <div className="review-header">
                    <button className="back-btn-list" onClick={onCancel}>Back to List</button>
                    <h2 className="review-title">Review Pending Request #{prefilledData.id}</h2>
                    <button className= "reject-btn" onClick={handleReject}>REJECT/DELETE</button>
                </div>
            )}

            <h3>{prefilledData ? 'Review & Approve Strategy' : 'Insert New Crew Strategy'}</h3>

            <div className="form-group guide-section">
                <label>Guide Type</label>
                <div className="pill-selector">
                    <button 
                        className={`pill-button ${guideType === 'video' ? 'active' : ''}`}
                        onClick={()=> setGuideType('video')}
                    >Video Guide</button>
                    <button
                        className={`pill-button ${guideType === 'text' ? 'active' : ''}`}
                        onClick={()=> setGuideType('text')}
                    >Text Guide</button>
                </div>
            </div>

            <div className="admin-form">

                <div className="form-group">
                    <label>Crew Title</label>
                    <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Local Sea Monster"
                    />
                </div>

                <div className="form-group">
                    <label>Stage ID (Database ID)</label>
                    <input 
                        type="number"
                        name="stage_id"
                        value={formData.stage_id}
                        onChange={handleChange}
                        placeholder="e.g. 15"
                    />
                </div>

                {guideType === 'video' ? (
                    <div className="form-group">
                        <label>Video URL</label>
                        <input 
                            type="text"
                            name="video_url"
                            value={formData.video_url}
                            onChange={handleChange}
                            placeholder ="https://youtube.com/..."
                        />
                    </div>
                ):(
                    <div className="form-group">
                        <label>Text Guide (JSON Format)</label>

                        <div className="json-actions-row" style={{marginBottom: '10px', display: 'flex', gap: '10px'}}>
                            <button 
                                className="admin-ctrl-btn preview"
                                onClick={()=>setIsPreviewOpen(true)}
                                type="button">Check Preview</button>
                            
                            <button 
                                className="admin-ctrl-btn edit"
                                onClick={()=> setIsVisualEditorOpen(true)}
                                type="button"
                            >Visual Editor</button>
                        </div>
                        <textarea 
                            className="json-editor"
                            name="text_guide_json"
                            value={formData.text_guide_json}
                            onChange={handleChange}
                            rows={10}
                            placeholder='{ "notes": [], "stages": [] }'
                        />
                        <small style={{color: 'var(--text-muted)'}}>Paste valid JSON here.</small>
                    </div>
                )}
                
                <div className="form-group">
                    <label>Crew Creator</label>

                    {creatorStatus.step === 'search' && (
                        <div className="search-row">
                            <span style={{color:'white', marginRight: '10px', fontSize: '0.8rem'}}>
                                {creatorStatus.inputType === 'key' ? 'Public Key' : 'URL'}
                            </span>

                            <input 
                                type="text"
                                value={creatorStatus.urlInput}
                                onChange={(e)=> setCreatorStatus({...creatorStatus, urlInput: e.target.value})}
                                placeholder={creatorStatus.inputType === 'key' ? "Enter Box Public Key" : "Channel URL"}
                            />
                            <button 
                                className="submit-btn search-btn"
                                onClick={handleCheckCreator}
                            >Check</button>
                        </div>
                    )}

                    {creatorStatus.step === 'not_found' && (
                        <div className="creator-box not-found">
                            <p className="warning-text">Creator not found in Database</p>

                            <div className="form-group">
                                <label>{creatorStatus.inputType === 'key' ? 'Public Key' : 'Channel URL'} (Read Only)</label>
                                <input type="text" value={creatorStatus.urlInput} disabled />
                            </div>

                            <div className="form-group">
                                <label>Enter Creator Name</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Toadskii"
                                    value={creatorStatus.tempName}
                                    onChange={(e)=> setCreatorStatus({...creatorStatus, tempName: e.target.value})}
                                />
                            </div> 

                            <div className="bottom-row">
                                <button className="cancel-btn" onClick={handleCancelCreator}>Cancel</button>
                                <button className="submit-btn" onClick={handleCreateCreator}>Create Creator</button>
                            </div> 
                        </div>
                    )}

                    {creatorStatus.step === 'verified' && creatorStatus.data && (
                        <div className="creator-box verified">
                            <p className="success-text">Creator Selected</p>
                            <div className="verified-info">
                                <span><strong>ID:</strong> {creatorStatus.data.id}</span>
                                <span><strong>Name:</strong>{creatorStatus.data.name}</span>
                            </div>
                            <small>{creatorStatus.data.social_url}</small>

                            <button className="cancel-btn" onClick={handleCancelCreator}>
                                Change Creator
                            </button>
                        </div>
                    )}
                </div>

                <div className="members-section admin-visual-members">
                    <h4 className="section-title">Crew Layout </h4>

                        {!editingSlot ? (
                            <div className="submission-grid">
                                {CREW_LAYOUT.map((slot) => (
                                    <div key={slot.mainId} className="grid-slot-wrapper">
                                        <div className="submission-slot main-slot" onClick={()=> handleSlotClick(slot.mainId)}>
                                            {members[slot.mainId] ? (
                                                <>
                                                    <img src = {`${members[slot.mainId].image_url}.png`} alt="char" className="selected-char-img" />
                                                        {members[slot.mainId].level && members[slot.mainId].level !== 'No' && (
                                                            <div className="level-badge">Lv.{members[slot.mainId].level}</div>
                                                        )}
                                                </>
                                                ): <div className="empty-slot-indicator">+</div>}
                            </div>
                            <div className="mini-label">{slot.label}</div>

                            {slot.hasSupport && (
                                <div className="submission-slot support-slot" onClick={()=> handleSlotClick(slot.supportId)}>
                                    {members[slot.supportId] ? (
                                        <>
                                            <img src={`${members[slot.supportId].image_url}.png`} alt="sup" className="selected-char-img" />
                                            {members[slot.supportId].supportType === 'optional' && <div className="optional-indicator">!</div>}
                                        </>
                                    ): <div className="empty-slot-indicator small">+</div>}
                                </div>
                            )}
                        </div> 
                                ))}
                        </div> 
                        ):(
                            selectedChar ? (
                                <CharacterDetailsView 
                                    character={selectedChar}
                                    isSupport={editingSlot.includes('Support')}
                                    onConfirm={(details) => {
                                        setMembers(prev => ({...prev, [editingSlot]: {...selectedChar, ...details }}));
                                        setSelectedChar(null);
                                        setEditingSlot(null);
                                    }}
                                    onBack={()=> setSelectedChar(null)}
                                />
                            ):(
                               <CharacterSelector 
                                    onSelect={(char) => setSelectedChar(char)}
                                    onBack={()=> setEditingSlot(null)}
                            />
                            )
                        )}
                    </div>
                </div>

        {!editingSlot && (
            <div className="submit-container">
                <button className="submit-btn big-btn" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CREW'}
                </button>
            </div>
        )}



        {isPreviewOpen && (
            <TextGuideModal 
                isOpen={true}
                onClose={()=> setIsPreviewOpen(false)}
                crewData={{
                    title: formData.title,
                    creator_name: creatorStatus.data?.name || "Preview Mode",
                    text_guide: formData.text_guide_json
                }}
            />
        )}

        {isVisualEditorOpen && (
            <div className="modal-overlay" style={{zIndex: 9999}}>
                <div className="admin-visual-editor-container">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', marginBottom:'20px'}}>
                        <h3 style={{color: 'var(--text-accent)', margin:0}}>Visual Guide Editor</h3>
                        <button 
                            onClick={()=> setIsVisualEditorOpen(false)}
                            style={{background: 'var(--color-danger)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Close & Done</button>
                            </div>
                    <TextGuideEditor 
                        initialData={(()=> {
                            try { return JSON.parse(formData.text_guide_json);}
                            catch {return {notes:[], stages:[]}; }
                        })()}
                        onSave={(newData) => {
                            setFormData({...formData, text_guide_json: JSON.stringify(newData, null, 2)});
                        }}
                    />
                </div>
            </div>
        )}   
     </div>
    );
}


export default InsertCrew;