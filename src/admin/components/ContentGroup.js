import React from 'react';

function ContentGroup({label, titleValue, onTitleChange, guideValue, onGuideChange, onPreview}) {
    return(
        <div className="form-group">
            <label>{label}</label>

            {/*Αν υπαρχει onTitleChange, δειχνουμε το input για το όνομα */}
            {onTitleChange && (
                <input 
                    type="text"
                    placeholder="Boss/Stage Name"
                    value={titleValue}
                    onChange={(e)=> onTitleChange(e.target.value)}
                    className="mb-10"
                /> 
            )}

            <textarea 
                className="json-editor"
                rows={5}
                value={guideValue}
                onChange={(e)=> onGuideChange(e.target.value)}
                placeholder='JSON Guide content...'
            />

            <button 
                className="admin-ctrl-btn preview mt-10 w-fit"
                onClick={()=> onPreview(guideValue)}
            >Preview Guide</button>
        </div>
    );
}
export default ContentGroup;