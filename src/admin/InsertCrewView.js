import React, {useEffect} from 'react';
import './Admin.css';
import toast from 'react-hot-toast';
import adminService from '../api/adminService';

//Hooks 
import { useCreatorManager } from './hooks/useCreatorManager';
import { useCrewSubmission } from './hooks/useCrewSubmission';

//UI Components
import CreatorFinder from './components/CreatorFinder';
import CrewFormFields from './components/CrewFormFields';
import CrewLayoutGrid from './components/CrewLayoutGrid';


function InsertCrewView({ adminSecret, prefilledData, onCancel, onApproveSuccess }) {

    const {
        creatorStatus, checkCreator, createCreator, resetCreator, updateCreatorState
    } = useCreatorManager(adminSecret);

    const {
        formData, setFormData, guideType, setGuideType, members, setMembers, isSubmitting, submitCrew, resetForm 
    } = useCrewSubmission(adminSecret, creatorStatus.data);

    //3. Logic για Reject
    const handleReject = async () => {
        if(!window.confirm("Are you sure you want to REJECT and DELETE this pending crew?")) return;
        try{
            await adminService.rejectPendingCrew(prefilledData.id, adminSecret);
            toast.success("Crew Rejected/Deleted");
            if(onApproveSuccess) onApproveSuccess(null); // Null σημαινει απλα refresh/back
        } catch (err){
            toast.error("Error rejecting crew");
        }
    }

    const handleSuccess = (newId) => {
        if(onApproveSuccess){
            onApproveSuccess(newId);
        } else {
            resetForm();
            resetCreator();
        }
    };

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    //4. Prefill Effect (Για όταν κανουμε Edit/Approve)
    useEffect(()=> {
        if(prefilledData){
            setFormData({
                title: prefilledData.title || '',
                stage_id: prefilledData.stage_id,
                video_url: prefilledData.video_url || '',
                text_guide_json: prefilledData.text_guide_details ? JSON.stringify(prefilledData.text_guide_details, null, 2): ''
            });
            setGuideType(prefilledData.guide_type);

            //Load Creator Data 
            if(prefilledData.creator_id){
                updateCreatorState({
                    step: 'verified',
                    data:{
                        id: prefilledData.creator_id,
                        name: prefilledData.creator_name || prefilledData.user_name 
                    }
                });
            } else if (prefilledData.creator_url){
                updateCreatorState({
                    step: 'search',
                    urlInput: prefilledData.creator_url
                });
                checkCreator({social_url: prefilledData.creator_url});
            }

            if(prefilledData.crew_data){
                const mappedMemebers = {};
                Object.entries(prefilledData.crew_data).forEach(([pos, data]) => {
                    if(data && data.id){
                        let notes = null;
                        if(pos.toLowerCase().includes('support')){
                            if(data.supportType === 'optional') notes = 'optional';
                        } else{
                            if (data.level && data.level !== 'No') notes = data.level;
                        }
                        mappedMemebers[pos] = {...data, character_id: data.id, notes: notes};
                    }
                });
                setMembers(mappedMemebers);
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefilledData]);



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

            <div className="admin-form">
                {/*1 Basic info & Guide Type*/}
                <CrewFormFields
                    formData={formData}
                    onChange={handleChange}
                    guideType={guideType}
                    setGuideType={setGuideType}
                />

                {/*2. Text Guide Editor (Only if Text Guide is selected)*/}
                {guideType === 'text' && (
                    <div className="form-group">
                        <label>Text Guide (JSON)</label>
                        <textarea 
                            className="json-editor"
                            value={formData.text_guide_json}
                            onChange={(e)=> setFormData({...formData, text_guide_json: e.target.value})}
                            rows={10}
                            placeholder='{ "notes": [], "stages": []}'
                        />
                        <p className="input-hint">
                            You can also use the Visual Editor from the main site (Add Crew) to generate this JSON 
                        </p>
                    </div> 
                )}

                {/*3. Creator Selection */}
                <CreatorFinder
                    status={creatorStatus}
                    onUpdate={updateCreatorState}
                    onCheck={checkCreator}
                    onCreate={createCreator}
                    onCancel={resetCreator}
                /> 

                {/*4. Crew Members Grid */}
                <CrewLayoutGrid
                    members={members}
                    setMembers={setMembers}
                />

                {/*5. Submit Action */}
                <div className="submit-container">
                    <button className="submit-btn big-btn" onClick={()=> submitCrew(handleSuccess)} disabled={isSubmitting}>
                        {isSubmitting ? 'SUBMITTING...' : (prefilledData ? 'APPROVE CREW' : 'SUBMIT CREW')}
                    </button>
                </div> 
            </div>
        </div> 
    );
}

export default InsertCrewView;
