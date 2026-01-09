import React, {useState} from "react";
import './Admin.css';

import { useAdminAuth } from "./hooks/useAdminAuth";
import InsertCharacterView from "./InsertCharacterView";
import InsertCrewView from "./InsertCrewView";
import ApproveCrewsView from "./ApproveCrewsView";
import ManageReportsView from "./ManageReportsView";
import InsertBannerView from "./InsertBannerView";
import ManageContentView from "./ManageContentView";


function AdminPanel({onExit}) {
    const {isAuthenticated, token, login, logout, loading} = useAdminAuth();
    const [secretInput, setSecretInput] = useState('');
    const [activeTab, setActiveTab] = useState('insert_char');


   const handleLoginSubmit = (e) =>{
        e.preventDefault();
        login(secretInput);
   };

   if(loading) return <div className="admin-container">Loading...</div>

    if(!isAuthenticated){
        return(
            <div className="admin-container">
                <form className="admin-login" onSubmit={handleLoginSubmit}>
                    <h2>Admin Access</h2>
                    <input 
                        type="password"
                        placeholder="Enter Admin Secret"
                        value={secretInput}
                        onChange={(e)=> setSecretInput(e.target.value)}
                    />
                    <button type="submit" className="submit-btn">Access Panel</button>
                </form>
            </div>
        );
    }

    const authProp = token;

    return(
        <div className="admin-container">
            <div className="admin-header">
                <h1>OPTC Database Admin</h1>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            <div className="admin-nav">
                <button
                    className={`admin-tab ${activeTab === 'insert_char' ? 'active' : ''}`}
                    onClick={()=> setActiveTab('insert_char')}
                >Insert Character</button>

                <button
                    className={`admin-tab ${activeTab === 'insert_crew' ? 'active': ''}`}
                    onClick={()=> setActiveTab('insert_crew')}
                >Insert Crew
                </button>

                <button 
                    className={`admin-tab ${activeTab === 'approve_crew' ? 'active' : ''}`}
                    onClick={()=> setActiveTab('approve_crew')}
                >Approve Crews</button>

                <button
                    className={`admin-tab ${activeTab === 'insert_banner' ? 'active' : ''}`}
                    onClick = {()=> setActiveTab('insert_banner')}
                >Insert Banner</button>

                <button 
                    className={`admin-tab ${activeTab === 'manage_reports' ? 'active' : ''}`}
                    onClick={()=> setActiveTab('manage_reports')}
                >Reports</button>

                <button 
                    className={`admin-tab ${activeTab === 'manage_content' ? 'active' : ''}`}
                    onClick={()=> setActiveTab('manage_content')}
                >Manage Content</button>
            </div>

            <div className="admin-content">
                {activeTab === 'insert_char' && <InsertCharacterView adminSecret={authProp} />}

                {activeTab === 'insert_crew' && (
                    <InsertCrewView adminSecret={authProp}/>
                )}

                {activeTab === 'approve_crew' && (
                    <ApproveCrewsView View adminSecret={authProp} />
                )}

                {activeTab === 'manage_reports' && (
                    <ManageReportsView adminSecret={authProp}/>
                )}

                {activeTab === 'insert_banner' && <InsertBannerView adminSecret={authProp}/>}

                {activeTab === 'manage_content' && <ManageContentView adminSecret={authProp} />}
            </div>
        </div>
    );
}

export default AdminPanel;