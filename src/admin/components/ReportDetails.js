import React from 'react';

function ReportDetails({report, onCancel, onResolve}) {
    return(
        <div className="admin-form">
            <div className="review-header">
                <button className="back-btn-list" onClick={onCancel}>Back to List</button>
                <h3 className="review-title">Report Detail</h3>
            </div>

            <div className="form-group">
                <label>Stage Name</label>
                <input type="text" value={report.stage_name || ''} readOnly />
            </div>

            <div className="form-group">
                <label>Crew Id</label>
                <input type="text" value={report.crew_id || ''} readOnly />
            </div>

            <div className="form-group mt-20">
                <label>Issue/Message</label>
                <textarea
                    className="json-editor"
                    rows={8}
                    value={report.message || ''}
                    readOnly
                />
            </div>

            <div className="button-row">
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                <button className="submit-btn" onClick={()=> onResolve(report.id)}>Resolved(Delete)</button>
                </div>
            </div>
    );
}

export default ReportDetails;