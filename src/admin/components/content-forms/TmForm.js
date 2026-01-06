import React, {useState} from 'react';
import ContentGroup from '../ContentGroup';

function TmForm({onUpdate, onPreview, loading}){
    const [data, setData] = useState({bossName: '', bossGuide: '', intrusionName: '', intrusionGuide: '' });

    const updateField = (field, value) => setData(prev => ({...prev, [field]: value}));

    return(
        <>
            <ContentGroup
                label="Boss Name & Guide (ID 290)"
                titleValue={data.bossName}
                onTitleChange={(val) => updateField('bossName', val)}
                guideValue={data.bossGuide}
                onGuideChange={(val) => updateField('bossGuide', val)}
                onPreview={onPreview}
            /> 

            <ContentGroup
                label="Intrusion Name & Guide (ID 291)"
                titleValue={data.intrusionName}
                onTitleChange={(val) => updateField('intrusionName', val)}
                guideValue={data.intrusionGuide}
                onGuideChange={(val) => updateField('intrusionGuide', val)}
                onPreview={onPreview}
            /> 

            <button
                className="submit-btn big-btn"
                onClick={()=> onUpdate('treasure_map', data)}
                disabled={loading}
            >UPDATE TM CONTENT</button>

        </>
    );
}

export default TmForm;