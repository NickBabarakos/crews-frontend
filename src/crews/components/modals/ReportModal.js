import React, { useState, useEffect } from 'react';
import BaseModal from '../../../components/modals/BaseModal';
import { useReportSubmit } from '../../hooks/useReportSubmit';
import './ReportModal.css';

/**
 * FEEDBACK / REPORT MODAL
 * Simple form to allow users to report issues with a crew (e.g. wrong support, impossible clear).
 */

function ReportModal({isOpen, onClose, crewData}){
    const [message, setMessage] = useState('');

    const {isSubmitting, submit} = useReportSubmit(onClose);


    useEffect(()=>{
        if(!isOpen){
            setMessage('');
        }
    }, [isOpen]);

    if(!isOpen || !crewData) return null;

    const handleSend = () => {
        submit(crewData.id, message);
    };

    const creatorName = crewData.creator_name || "Community Crew";
    const stageName = crewData.stage_name || "Unknown Stage"

    const footerButtons =(
        <>
            <button className="base-btn base-btn-secondary" onClick={onClose}>Cancel</button>
            <button 
                className="base-btn base-btn-primary"
                onClick={handleSend}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Submit Report'}
            </button>
        </>
    );

    return(
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Report / Feedback"
            size="small"
            footer={footerButtons}
        >
            <div className="report-subtitle report-meta-info">
                <span className="subtitle-label">Stage:</span> {stageName} •
                <span className="subtitle-label">Creator:</span> {creatorName}
            </div>
              
            <div className="report-body">
                <p className="report-instruction">
                      Spot an error? Let us know if there are wrong details regarding Level Limit Break requirements, Support Optionality, etc...
                </p>

                <textarea 
                    className="report-input"
                    placeholder="Describe the issue here..."
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
                    rows={5}
                    maxLength={1000}
                />
            </div>
        </BaseModal>
    );

}

export default ReportModal;