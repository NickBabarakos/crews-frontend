import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InsertCrew from './InsertCrew';
import './Admin.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ApproveCrews({ adminSecret }){
    const [pendingList, setPendingList] = useState([]);
    const [selectedCrew, setSelectedCrew] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        setLoading(true);
        try{
            const res = await axios.get(`${BASE_URL}/api/admin/pending-crews`, {
                headers: {'x-admin-secret': adminSecret}
            });
            setPendingList(res.data);
        } catch(err){
            console.error(err);
            alert("Failed to load pending crews");
        } finally{
            setLoading(false);
        }
    };

    useEffect(()=> {
        fetchPending();
    }, []);

    const handleApproveSuccess = async (pendingId) => {
        if(pendingId){
            try{
                await axios.delete(`${BASE_URL}/api/admin/pending-crews/${pendingId}`, {
                    headers: { 'x-admin-secret': adminSecret}
                });
            } catch(err){
                alert("Crew Created, but failed to delete pending request automatically. Please reject manually");
            }
        }
        setSelectedCrew(null);
        fetchPending();
    };

    if(selectedCrew){
        return(
            <InsertCrew 
                adminSecret={adminSecret}
                prefilledData={selectedCrew}
                onCancel={()=> setSelectedCrew(null)}
                onApproveSuccess={handleApproveSuccess}
            />
        );
    }

    return(
        <div className="approve-container">
            <h2>Pending Approvals ({pendingList.length})</h2>

            {loading? <p>Loading...</p>: (
                <div className="pending-grid">
                    {pendingList.length === 0 && <p> No pending crews.</p>}

                    {pendingList.map(item => (
                        <div key={item.id} className="pending-card" onClick={()=> setSelectedCrew(item)}>
                            <div className="card-header">
                                <span className={`type-badge ${item.guide_type}`}>
                                    {item.guide_type.toUpperCase()}
                                </span>
                                <span className="date-text">ID: {item.id}</span>
                            </div>

                            <h4>Stage: {item.stage_name} (ID: {item.stage_id})</h4>
                            <p> <strong>User:</strong>{item.user_name}</p>
                            <p><strong>Creator:</strong>{item.creator_url ? 'Provided' : 'None' }</p>

                            <div className="card-footer">
                                <small>Click to Review</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ApproveCrews;