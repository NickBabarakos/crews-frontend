import React from 'react';

function ReportList({reports, loading, onSelect, onRefresh}) {
    return(
         <div className="approve-container">
            <div className="review-header">
                <h2>User Reports ({reports.length})</h2>
                <button className="back-btn-list" onClick={onRefresh}>Refresh</button>
            </div> 
            
            {loading ? (
                <div className="loading-text">Loading...</div>
            ) : reports.length === 0 ? (
                <div className="placeholder-section">
                    <h4>No active reports.</h4>
                </div> 
            ):(
                <div className="pending-grid">
                    {reports.map(report => (
                        <div key={report.id} className="pending-card" onClick={()=> onSelect(report)}>
                            <div className="card-header">
                                <span className="date-text">
                                    {new Date(report.created_at).toLocaleDateString()}
                                </span>
                                <span className="date-text">ID: {report.id}</span>
                            </div>
                            <h4>Stage: {report.stage_name}</h4>
                            <p><strong>Crew Title:</strong> {report.crew_title}</p>
                            <div className="card-footer">
                                <small>Click to read message</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReportList;