import React, {useState} from "react";
import axios from 'axios';
import StageGuideModal from "../crews/components/modals/StageGuideModal";
import './Admin.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageContent({ adminSecret }){
    const [activePill, setActivePill ] = useState('pka');
    const [loading, setLoading ] = useState(false);

    const [previewData, setPreviewData] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [pkaData, setPkaData] = useState({bossName: '', bossGuide80: '', bossGuide100: '', bossGuide150: ''});
    const [tmData, setTmData] = useState({bossName: '', bossGuide: '', intrusionName: '', intrusionGuide: '' });
    const [kizunaData, setKizunaData] = useState({b1Name: '', b1Guide: '', b2Name: '', b2Guide: '', sb1Name: '', sb1Guide: '', sb2Name: '', sb2Guide: ''});
    const [deleteId, setDeleteId] = useState('');

    const openPreview = (jsonString) => {
        try{
            const parsed = JSON.parse(jsonString);
            setPreviewData(parsed);
            setIsPreviewOpen(true);
        } catch (e) {
            alert("Invalid JSON format");
        }
    };

    const handleUpdateEvent = async (mode, data) => {
        if(!window.confirm(`Are you sure you want to rotate/update ${mode}? This will delete old crews`)) return;
        setLoading(true);
        try{
            await axios.post(`${BASE_URL}/api/admin/update-event-content`, 
                {mode, data},
                {headers: { 'x-admin-secret': adminSecret}}
            );
            alert("Content updated successfully!");
        } catch (err) {
            alert("Error:" + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCrew = async () => {
        if(!deleteId) return;
        if(!window.confirm(`PERMANENTLY DELETE CREW #${deleteId}?`)) return;

        try{
            await axios.delete(`${BASE_URL}/api/admin/crews/${deleteId}`, {
                headers: {'x-admin-secret': adminSecret}
            });
            alert("Crew deleted");
            setDeleteId('');
        } catch (err){
            alert("Error deleting crew");
        }
    };

    return(
        <div className="manage-content-container">
            <div className="pill-selector" style={{marginBottom: '20px'}}>
                {['pka', 'tm', 'kizuna', 'delete'].map(pill => (
                    <button 
                        key={pill}
                        className={`pill-button ${activePill === pill ? 'active' : ''}`}
                        onClick={()=> setActivePill(pill)}
                    >
                        {pill.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="admin-form">
                {activePill === 'pka' && (
                    <>
                        <div className="form-group">
                            <label>New Boss Name (will be set to IDs 287, 288, 289)</label>
                            <input 
                                type="text"
                                value={pkaData.bossName}
                                onChange={e => setPkaData({...pkaData, bossName: e.target.value})}/>
                        </div>
                        {[
                            {label: 'Level 80-99 Guide (ID 287)', key: 'bossGuide80'},
                            {label: 'Level 100-149 Guide (ID 288)', key: 'bossGuide100'},
                            {label: 'Level 150+ Guide (Id 289)', key: 'bossGuide150'}
                        ].map(field => (
                            <div className="form-group" key={field.key}>
                                <label>{field.label}</label>
                                <textarea 
                                    className="json-editor"
                                    rows={5}
                                    value={pkaData[field.key]}
                                    onChange={e => setPkaData({...pkaData, [field.key]: e.target.value})}
                                />
                                <button className="admin-ctrl-btn preview" onClick={()=> openPreview(pkaData[field.key])}>Preview Guide</button>
                            </div>
                        ))}
                        <button className="submit-btn big-btn" onClick={()=> handleUpdateEvent('pirate_king_adventures', pkaData)} disabled={loading}>ROTATE PKA & INSERT NEW BOSS</button>
                    </>
                )}

                {activePill === 'tm' && (
                    <>
                        <div className="form-group">
                            <label>Boss Name & Guide (ID 290)</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={tmData.bossName}
                                onChange={e=> setTmData({...tmData, bossName: e.target.value})} />
                            <textarea 
                                className="json-editor"
                                rows={5}
                                value={tmData.bossGuide}
                                onChange={e => setTmData({...tmData, bossGuide: e.target.value})} />
                            <button 
                                className="admin-ctrl-btn preview" 
                                onClick={()=> openPreview(tmData.bossGuide)}
                            >Preview Boss</button>
                        </div>
                        
                        <div className = "form-group">
                            <label>Intrusion Name & Guide (ID 291)</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={tmData.intrusionName}
                                onChange={e => setTmData({...tmData, intrusionName: e.target.value})} /> 
                            <textarea 
                                className="json-editor"
                                rows={5}
                                value={tmData.intrusionGuide}
                                onChange={e=> setTmData({...tmData, intrusionGuide: e.target.value})} />
                            <button 
                                className="admin-ctrl-btn preview"
                                onClick={()=> openPreview(tmData.intrusionGuide)}>Preview Intrusion</button> 
                        </div>

                        <button 
                            className="submit-btn big-btn" 
                            onClick={()=> handleUpdateEvent('treasure_map', tmData)}
                            disabled={loading}>UPDATE TM CONTENT</button>
                    </>
                )}

                {activePill === 'kizuna' && (
                    <>
                        <div className="form-group">
                            <label>Boss 1 Name & Guide (ID 292)</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={kizunaData.b1Name}
                                onChange={e=>setKizunaData({...kizunaData, b1Name: e.target.value})} />
                            <textarea
                                className="json-editor"
                                rows={4}
                                value={kizunaData.b1Guide}
                                onChange={e => setKizunaData({...kizunaData, b1Guide: e.target.value})}/>
                            <button 
                                className="admin-ctrl-btn preview"
                                onClick={()=> openPreview(kizunaData.b1Guide)}>Preview B1</button> 
                        </div>

                        <div className="form-group">
                            <label>Boss 2 Name & Guide</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={kizunaData.b2Name}
                                onChange={e=> setKizunaData({...kizunaData, b2Name: e.target.value})}/>
                            <textarea
                                className="json-editor"
                                rows={4}
                                value={kizunaData.b2Guide}
                                onChange={e => setKizunaData({...kizunaData, b2Guide: e.target.value})}/>
                            <button 
                                className="admin-ctrl-btn preview" 
                                onClick={()=> openPreview(kizunaData.b2Guide)}
                            >Preview B2</button>
                        </div>

                        <div className="form-group">
                            <label>Super Boss 1 Name & Guide (ID 294)- Put "No" in name if none</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={kizunaData.sb1Name}
                                onChange={e=> setKizunaData({...kizunaData, sb1Name: e.target.value})}/>
                            <textarea
                                className="json-editor"
                                rows={4}
                                value={kizunaData.sb1Guide}
                                onChange={e => setKizunaData({...kizunaData, sb1Guide: e.target.value})}/>
                            <button 
                                className="admin-ctrl-btn preview" 
                                onClick={()=> openPreview(kizunaData.sb1Guide)}
                            >Preview SB1</button>
                        </div>

                        <div className="form-group">
                            <label>Super Boss 2 Name & Guide (ID 295)- Put "No" in name if none</label>
                            <input 
                                type="text"
                                placeholder="Name"
                                value={kizunaData.sb2Name}
                                onChange={e=> setKizunaData({...kizunaData, sb2Name: e.target.value})}/>
                            <textarea
                                className="json-editor"
                                rows={4}
                                value={kizunaData.sb2Guide}
                                onChange={e => setKizunaData({...kizunaData, sb2Guide: e.target.value})}/>
                            <button 
                                className="admin-ctrl-btn preview" 
                                onClick={()=> openPreview(kizunaData.sb2Guide)}
                            >Preview SB2</button>
                        </div>

                        <button 
                            className="submit-btn big-btn"
                            onClick={()=> handleUpdateEvent('kizuna_clash', kizunaData)}
                            disabled={loading}
                        >UPDATE KIZUNA CONTENT</button>
        
                    </>
                )}

                {activePill === 'delete' && (
                    <div className="form-group">
                        <label>Enter Crew Id to Delete</label>
                        <input 
                            type="number"
                            value={deleteId}
                            onChange={e => setDeleteId(e.target.value)} />
                        <button 
                            className="reject-btn"
                            style={{marginTop: '10px', padding: '15px'}}
                            onClick={handleDeleteCrew}
                        >DELETE CREW PERMANENTLY</button>
                    </div>
                )}
            </div>

            <StageGuideModal 
                isOpen={isPreviewOpen}
                onClose={()=> setIsPreviewOpen(false)}
                guideData={previewData}
            />
        </div>
    );
}

export default ManageContent;