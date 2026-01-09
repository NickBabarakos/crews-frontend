import React from 'react';
import PendingCrewCard from './PendingCrewCard';

function PendingCrewGrid({crews, loading, onSelect, onRefresh}){
    return(
        <div className="approve-container">
            <div className="review-header">
                <h2 className="review-title">Pending Submissions ({crews.length})</h2>
                <button className="refresh-btn" onClick={onRefresh}>Refresh</button>
            </div>

            {loading ? (
                <div className="loading-text">Loading...</div>
            ): crews.length === 0 ? (
                <div className="placeholder-section">
                    <h4>No pending crews found. Good job!</h4>
                </div>
            ):(
                <div className="pending-grid">
                    {crews.map(crew => (
                        <PendingCrewCard
                            key={crew.id}
                            crew={crew}
                            onClick={()=> onSelect(crew)}
                        />
                    ))}  
                </div>  
            )}
        </div>
    );
}

export default PendingCrewGrid;