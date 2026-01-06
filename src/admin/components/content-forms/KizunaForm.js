import React, {useState} from 'react';
import ContentGroup from '../ContentGroup';

function KizunaForm({onUpdate, onPreview, loading}){
    const [data, setData] = useState({b1Name: '', b1Guide: '', b2Name: '', b2Guide: '', sb1Name: '', sb1Guide: '', sb2Name: '', sb2Guide: ''});

    const updateField = (field, value) => setData(prev => ({...prev, [field]: value}));

    return(
        <>
            <ContentGroup
                label="Boss 1 (ID 292)"
                titleValue={data.b1Name}
                onTitleChange={(val) => updateField('b1Name', val)}
                guideValue={data.b1Guide}
                onGuideChange={(val) => updateField('b1Guide', val)}
                onPreview={onPreview}
            /> 

            <ContentGroup
                label="Boss 2 (ID 293)"
                titleValue={data.b2Name}
                onTitleChange={(val) => updateField('b2Name', val)}
                guideValue={data.b2Guide}
                onGuideChange={(val) => updateField('b2Guide', val)}
                onPreview={onPreview}
            /> 

            <ContentGroup
                label="Super Boss 1 (ID 294)"
                titleValue={data.sb1Name}
                onTitleChange={(val) => updateField('sb1Name', val)}
                guideValue={data.sb1Guide}
                onGuideChange={(val) => updateField('sb1Guide', val)}
                onPreview={onPreview}
            /> 

            <ContentGroup
                label="Super Boss 2 (ID 295)"
                titleValue={data.sb2Name}
                onTitleChange={(val) => updateField('sb2Name', val)}
                guideValue={data.sb2Guide}
                onGuideChange={(val) => updateField('sb2Guide', val)}
                onPreview={onPreview}
            /> 
            
            

            <button
                className="submit-btn big-btn"
                onClick={()=> onUpdate('kizuna_clash', data)}
                disabled={loading}
            >UPDATE KIZUNA CONTENT</button>

        </>
    );
}

export default KizunaForm;