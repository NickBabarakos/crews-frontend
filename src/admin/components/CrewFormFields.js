import React from 'react';

function CrewFormFields({ formData, onChange, guideType, setGuideType}) {
    return(
        <>
            <div className="form-group guide-section">
                <label>Guide Type</label>
                <div className="pill-selector">
                    <button 
                        className={`pill-button ${guideType === 'video' ? 'active' : ''}`}
                        onClick={()=> setGuideType('video')}
                    >Video Guide</button>
                    <button
                        className={`pill-button ${guideType === 'text' ? 'active' : ''}`}
                        onClick={()=> setGuideType('text')}
                    >Text Guide</button>
                </div>
            </div>


            <div className="form-group">
                <label>Crew Title</label>
                <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g. Local Sea Monster"
                />
            </div>

            <div className="form-group">
                <label>Stage ID (Database ID)</label>
                <input 
                    type="number"
                    name="stage_id"
                    value={formData.stage_id}
                    onChange={onChange}
                    placeholder="e.g. 15"
                />
            </div>

            {guideType === 'video' && (
                <div className="form-group">
                    <label>Video URL</label>
                    <input 
                        type="text"
                        name="video_url"
                        value={formData.video_url}
                        onChange={onChange}
                        placeholder ="https://youtube.com/..."
                    />
                </div>
            )}
        </>
    );
}
export default CrewFormFields;