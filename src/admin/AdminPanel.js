import React, {useState, useEffect } from "react";
import axios from 'axios';
import './Admin.css';
import InsertCharacter from './InsertCharacter';
import InsertCrew from "./InsertCrew";
import ApproveCrews from "./ApproveCrews";
import ManageReports from "./ManageReports";
import InsertBanner from "./InsertBanner";
import ManageContent from "./ManageContent";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function AdminPanel({onExit}) {
    const [isAuthenticated, setIsAuthenticated] = useState(()=> { return !!sessionStorage.getItem('admin_secret');});
    const [secretInput, setSecretInput] = useState(()=> {return sessionStorage.getItem('admin_secret') || '';});
    const [activeTab, setActiveTab] = useState('insert_char');


    const handleLogin = async (e) => {
        e.preventDefault();

        if(secretInput.length > 5){
            try{
                await axios.get(`${BASE_URL}/api/admin/reports`, {
                    headers: {'x-admin-secret': secretInput}
                });

                sessionStorage.setItem('admin_secret', secretInput);
                setIsAuthenticated(true);
            }catch(err){
                alert("Wrong Admin Secret! Access Denied.");
                setSecretInput('');
                if(onExit) onExit();
            }
            } else {
            alert("Password too short");
            if (onExit) onExit();
        }
    };

    const handleLogout = ()=> {
        sessionStorage.removeItem('admin_secret');
        setIsAuthenticated(false);
        setSecretInput('');
    }

    if(!isAuthenticated){
        return(
            <div className="admin-container">
                <form className="admin-login" onSubmit={handleLogin}>
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

    return(
        <div className="admin-container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>OPTC Database Admin</h1>
                <button onClick={handleLogout} style={{background:'red', color:'white', border:'none', padding: '5px 10px',
                    borderRadius:'4px', cursor:'pointer'}}>Logout</button>
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
                {activeTab === 'insert_char' && <InsertCharacter adminSecret={secretInput} />}

                {activeTab === 'insert_crew' && (
                    <InsertCrew adminSecret={secretInput}/>
                )}

                {activeTab === 'approve_crew' && (
                    <ApproveCrews adminSecret={secretInput} />
                )}

                {activeTab === 'manage_reports' && (
                    <ManageReports adminSecret={secretInput}/>
                )}

                {activeTab === 'insert_banner' && <InsertBanner adminSecret={secretInput}/>}

                {activeTab === 'manage_content' && <ManageContent adminSecret={secretInput} />}
            </div>
        </div>
    );
}

export default AdminPanel;