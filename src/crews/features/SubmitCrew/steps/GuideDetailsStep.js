import React from "react";
import TextGuideEditor from "../../SubmitCrew/TextGuideEditor";
import '../SubmitCrewModal.css';

/**
 * STEP 2: CONTENT EDITOR
 * ----------------------
 * Switches between a simple INPUT field (for Video URLs) and
 * a complex Text Editor (for written strategies) based on 'guideType'.
 */
function GuideDetailsStep({
    guideType,
    videoUrl,
    setVideoUrl,
    socialInput,
    setSocialInput,
    textGuideData,
    setTextGuideData
}) {
    return(
        <div className="step-container">
            {guideType === 'video' ? (
                // Simple Form for Video
                <div className="video-input-wrapper">
                    <div className="input-group">
                        <label>Video_Url <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input
                                type="text"
                                className="modal-input glass-input"
                                placeholder="https://youtube.com/..."
                                value={videoUrl}
                                onChange={(e)=> setVideoUrl(e.target.value)}
                            />
                    </div>
                    <div className="input-group">
                        <label>Video Guide Creator (Optional)</label>
                        <input
                            type="text"
                            className="modal-input glass-input"
                            placeholder="e.g. youtube.com/@{handle}..."
                            value={socialInput}
                            onChange={(e)=>setSocialInput(e.target.value)}
                        />
                    </div>
                </div>
            ):(
                //Complex Editor for text
                <TextGuideEditor 
                    initialData={textGuideData}
                    onSave={(newData) => setTextGuideData(newData)}
                />
            )}
        </div>
    );
}

export default GuideDetailsStep;