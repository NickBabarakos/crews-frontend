import React from 'react';

function PendingCrewCard({crew, onClick}){
    return(
        <div className="pending-card" onClick={onClick}>
            <div className="card-header">
                <span className={`type-badge ${crew.guide_type}`}>
                    {crew.guide_type === 'video' ? 'VIDEO' : 'TEXT'}
                </span>
                
                <span className="date-text">
                    {new Date(crew.submitted_at).toLocaleDateString()}
                </span>
            </div>

            <h4>{crew.title || "Untitled Strategy"}</h4>
            <p className="stage-id-text">
                {crew.stage_name || `STAGE ID: ${crew.stage_id}`}
            </p>
            
            <p className="user-info">
                By: {crew.user_name}
                {crew.confirmed_creator_id && <span className="verified-text">(Verified)</span>}
            </p>

            <div className="card-footer">
                Click to Review & Approve
            </div>
        </div>
    );
}

export default PendingCrewCard;