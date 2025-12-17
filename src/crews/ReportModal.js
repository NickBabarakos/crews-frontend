import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import './ReportModal.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ReportModal({isOpen, onClose, crewData}){
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(()=>{
        if(!isOpen){
            setMessage('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if(!isOpen || !crewData) return null;

    const handleSubmit = async () => {
        if(!message.trim()){
            toast.error("Please write a message first.");
            return;
        }

        setIsSubmitting(true);
        try{
            await axios.post(`${BASE_URL}/api/reports/submit`, {
                crew_id: crewData.id,
                message: message
            });
            toast.success("Report submitted successfully");
            onClose();
        } catch( error){
            console.error("Report failed", error);
            toast.error("Failed to submit report");
        }finally{
            setIsSubmitting(false);
        }
    };

    const creatorName = crewData.creator_name || "Community Crew";
    const stageName = crewData.stage_name || "Unknown Stage"

    return (
        <div className="report-modal-overlay" onClick={onClose}>
            <div className="report-modal-content" onClick={(e)=> e.stopPropagation()}>
                <div className="report-header">
                    <h3>Report/Feedback</h3>
                    <div className="report-subtitle">
                        <span className="subtitle-label">Stage:</span> {stageName}•
                        <span className="subtitle-label">Creator:</span> {creatorName}
                    </div>
                </div>

                <div className="report-body">
                    <p className="report-instruction">
                        Spot an error? Let us know if there are wrong details regarding Level Limit Break requirements, Support Optionallity, etc...
                    </p>

                    <textarea 
                        className="report-input"
                        placeholder="Describe the issue here..."
                        value={message}
                        onChange={(e)=> setMessage(e.target.value)}
                        rows={5}
                    />
                </div>

                <div className="report-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Submit Reports'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;