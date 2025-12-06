import React, {useState } from 'react';
import axios from 'axios';

const BASE_URL = " http://10.69.190.150:3000";

const CHAR_TYPES = [
    'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 'Pirate Alliance Kizuna Clash Sugo-Fest Only',
    'Exchange Only', 'Sugo Rare', '6+ Legend', 'Rare Recruit', 'Treasure Map Rare Recruit', 'Kizuna Clash Limited Character',
    'Rumble Rare Recruit', 'Support Character', '5+ Rare Recruit'
];

function InsertCharacter({adminSecret}) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        info_url: '',
        type: 'Rare Recruit'
    });
    const [status, setStatus] = useState({type:'', msg: ''});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({type:'', msg: ''});

        try{
            const response = await axios.post(
                `${BASE_URL}/api/admin/character`,
                formData,
                {headers: {'x-admin-secret': adminSecret}}
            );

            setStatus({type: 'success', msg: response.data.message});
            setFormData(prev=> ({...prev, id:'', name:'', info_url: ''}));
        } catch(err){
            const errorMsg = err.response?.data?.error || 'Something went wrong';
            setStatus({type: 'error', msg: errorMsg});
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="insert-char-container">
            <h3>Insert New Character</h3>
            <form onSubmit={handleSubmit} className="admin-form" autoComplete="off">
                <div className="form-group">
                    <label>ID (In-Game ID)</label>
                    <input 
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="e.g 4483"
                        required
                        autoComplete = "off"
                    />
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sanji & Reiju"
                        required
                        autoComplete = "off"
                    />
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        {CHAR_TYPES.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Info URL (DB Link)</label>
                    <input 
                        type="text"
                        name="info_url"
                        value={formData.info_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                        autoComplete = "off"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Inserting...' : 'Add Character'}
                </button>

                {status.msg && (
                    <div className={`status-msg ${status.type}`}>
                        {status.msg}
                    </div>
                )}
            </form>
        </div>
    );
}

export default InsertCharacter;