import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InsertCrew from './InsertCrew';
import './Admin.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ApproveCrews({adminSecret}) {
    const [pendingCrews, setPendingCrews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCrew, setSelectedCrew] = useState(null);

    useEffect(()=> {
        fetchPendingCrews();
    }, []);

    const fetchPendingCrews = async () => {
        setLoading(true);
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/pending-crews`, {
                headers: { 'x-admin-secret': adminSecret}
            });
            setPendingCrews(res.data);
        } catch (err){
            console.error("Failed to fetch pending crews", err);
            alert("Erro fetching pending list");
        } finally {
            setLoading(false);
        }
    };

    const handleProcessComplete = async (processedId) => {
        if(processedId && selectedCrew) {
            try{
                await axios.delete(`${BASE_URL}/api/admin/pending-crews/${selectedCrew.id}`,{
                    headers: {'x-admin-secret': adminSecret}
                } );
            } catch (err){
                console.error("Warning: Crew approved but failed to delete from pending list", err);
                alert("Crew Approved, but clean-up of pending list failed. Please delete manually");
            }
        }

        setSelectedCrew(null);
        fetchPendingCrews();

    };

    if(selectedCrew){
        return(
            <InsertCrew 
                adminSecret={adminSecret}
                prefilledData={selectedCrew}
                onCancel={()=> setSelectedCrew(null)}
                onApproveSuccess={handleProcessComplete}
            />
        );
    }

    return(
        <div className="approve-container">
            <div className="review-header">
                <h2 className="review-title">Pending Submissions ({pendingCrews.length})</h2>
                <button className="back-btn-list" onClick={fetchPendingCrews}>Refresh</button>
            </div>

            {loading ? (
                <div style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>Loading...</div>
            ): pendingCrews.length === 0 ? (
                <div className="placeholder-section">
                    <h4>No pending crews found. Good job!</h4>
                </div>
            ):(
                <div className="pending-grid">
                    {pendingCrews.map(crew => (
                        <div 
                            key={crew.id}
                            className="pending-card"
                            onClick={()=> setSelectedCrew(crew)}
                        >
                            <div className="card-header">
                                <span className={`type-badge ${crew.guide_type}`}>
                                    {crew.guide_type === 'video' ? 'VIDEO' : 'TEXT'}
                                </span>
                                <span className="date-text">
                                    {new Date(crew.submitted_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h4>{crew.title || "Untitled Strategy"}</h4>
                            <p style={{color: 'var(--text-accent)', fontSize: '0.9rem', fontWeight: 'bold'}}>
                                {crew.stage_name || `STAGE ID: ${crew.stage_id}`}
                            </p>
                            <p className="user-info">
                                By: {crew.user_name}
                                {crew.confirmed_creator_id && <span style={{color: '#4ade80'}}>(Verified)</span>}
                            </p>

                            <div clasName="card-footer">
                                Click to Review & Approve
                            </div>
                        </div>
                    ))}  
                </div>  
            )}
        </div>
    );
}

export default ApproveCrews;