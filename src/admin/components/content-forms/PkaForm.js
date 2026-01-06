import React, {useState} from 'react';
import ContentGroup from '../ContentGroup';

function PkaForm({onUpdate, onPreview, loading}) {
    const [data, setData] = useState({bossName: '', bossGuide80: '', bossGuide100: '', bossGuide150: ''});

    const updateField = (field, value) => setData(prev => ({...prev, [field]: value}));

    return(
        <>
        <div className="form-group">
            <label>New Boss Name (IDs 287, 288, 289)</label>
            <input 
                type="text"
                value={data.bossName}
                onChange={(e=> updateField('bossName', e.target.value))}
            />
        </div>

        <ContentGroup
            label="Level 80-99 Guide (ID 287)"
            guideValue={data.bossGuide80}
            onGuideChange={(val) => updateField('bossGuide80', val)}
            onPreview={onPreview}
        /> 

        <ContentGroup
            label="Level 100-149 Guide (ID 288)"
            guideValue={data.bossGuide100}
            onGuideChange={(val) => updateField('bossGuide100', val)}
            onPreview={onPreview}
        /> 

        <ContentGroup
            label="Level 150+ Guide (ID 289)"
            guideValue={data.bossGuide150}
            onGuideChange={(val) => updateField('bossGuide150', val)}
            onPreview={onPreview}
        /> 

        <button
            className="submit-btn big-btn"
            onClick={()=> onUpdate('pirate_king_adventures', data)}
            disabled={loading}
        >ROTATE PKA & INSERT NEW BOSS</button>
        
    </>
    );
}

export default PkaForm;