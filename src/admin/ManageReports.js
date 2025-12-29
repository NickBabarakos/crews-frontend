import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageReports({adminSecret}) {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/reports`, {
                headers: { 'x-admin-secret':adminSecret}
            });
            setReports(res.data);
        } catch(err){
            console.error(err);
            alert("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        fetchReports();
    }, []);

    const handleResolve = async(id) => {
        if(!window.confirm("Mark as resolved and delete this report?")) return;

        try{
            await axios.delete(`${BASE_URL}/api/admin/reports/${id}`, {
                headers: { 'x-admin-secret': adminSecret} 
            });
            setSelectedReport(null);
            fetchReports();
        } catch(err){
            alert("Failed to delete report");
        }
    };

    if(selectedReport){
        return(
            <div className="admin-form">
                <div className="review-header">
                    <button className="back-btn-list" onClick={()=> setSelectedReport(null)}>Back to List</button>
                    <h3 className="review-title">Report Detail</h3>
                </div>

                <div className="form-group">
                    <label>Stage Name</label>
                    <input type="text" value={selectedReport.stage_name} readOnly />
                </div>

                <div className="form-group">
                    <label>Crew Id</label>
                    <input type="text" value={selectedReport.crew_id} readOnly />
                </div>

                <div className="form-group mt-20">
                    <label>Issue/Message</label>
                    <textarea
                        className="json-editor"
                        rows={8}
                        value={selectedReport.message}
                        readOnly
                    />
                </div>

                <div className="button-row">
                    <button className="cancel-btn" onClick={()=> setSelectedReport(null)}>Cancel</button>
                    <button className="submit-btn" onClick={()=> handleResolve(selectedReport.id)}>Cheched(Delete)</button>
                </div>
            </div>
        );
    }

    return(
        <div className="approve-container">
            <h2>user Reports ({reports.length})</h2>
            {loading ? <p>Loading...</p>:(
                <div className="pending-grid">
                    {reports.length === 0 && <p>No active reports.</p>}
                    {reports.map(report => (
                        <div key={report.id} className="pending-card" onClick={()=> setSelectedReport(report)}>
                            <div className="card-header">
                                <span className="date-text">
                                    {new Date(report.created_at).toLocaleDateString()}
                                </span>
                                <span className="date-text">ID: {report.id}</span>
                            </div>
                            <h4>Stage: {report.stage_name}</h4>
                            <p><strong>Crew Title:</strong> {report.crew_title}</p>
                            <div classname="card-footer">
                                <small>Click to read message</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageReports;