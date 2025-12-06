import React, {useState, useEffect } from "react";
import './Admin.css';
import InsertCharacter from './InsertCharacter';

function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(()=> { return !!sessionStorage.getItem('admin_secret');});
    const [secretInput, setSecretInput] = useState(()=> {return sessionStorage.getItem('admin_secret') || '';});
    const [activeTab, setActiveTab] = useState('insert_char');


    const handleLogin = (e) => {
        e.preventDefault();
        if(secretInput.length > 5){
            sessionStorage.setItem('admin_secret', secretInput);
            setIsAuthenticated(true);
        } else {
            alert("Password too short");
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
                >Inset Character</button>

                <button
                    className={`admin-tab ${activeTab === 'insert_crew' ? 'active': ''}`}
                    onClick={()=> setActiveTab('insert_crew')}
                    disabled 
                >Insert Crew (Coming Soon)
                </button>

                <button 
                    className={`admin-tab ${activeTab === 'approve_crew' ? 'active' : ''}`}
                    onClick={()=> setActiveTab('approve_crew')}
                    disabled 
                >Approve Crews</button>

                <button
                    className={`admin-tab ${activeTab === 'insert_banner' ? 'active' : ''}`}
                    onClick = {()=> setActiveTab('insert_banner')}
                    disabled
                >Insert Banner (Coming Soon)</button>
            </div>

            <div className="admin-content">
                {activeTab === 'insert_char' && <InsertCharacter adminSecret={secretInput} />}

                {activeTab === 'insert_crew' && (
                    <div style={{textAlign:'center', marginTop:'50px'}}>
                        <h3>Crew Insert Panel coming in next update...</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;