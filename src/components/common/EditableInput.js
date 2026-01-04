import React, {useState} from "react";

function EditableInput({value, onSave, onDelete, placeholder, isNew= false, isHeader= false, icon = "+"}){
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value || '');

    const handleClick = () => {
        setIsEditing(true);
        setTempValue(value || '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter'){
            handleBlur();
        }
    };

    const handleBlur = () => {
        if (tempValue.trim()) {
            onSave(tempValue);
            if (isNew) setTempValue('');
        }
        setIsEditing(false);
    };

    if(isEditing){
        return(
            <input
                autoFocus
                type="text"
                className={`editable-input ${isHeader ? 'header-mode' : ''}`}
                value={tempValue}
                onChange={(e)=> setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder= {placeholder}
            />
        );
    }

    if (isNew){
        return (
            <div className="editable-box placeholder" onClick={handleClick}>
                <span className="plus-icon">{icon}</span>
                <span className="placeholder-text">{placeholder}</span>
            </div>
        );
    }

    return(
        <div 
            className={`editable-box saved ${isHeader ? 'header-mode' : ''}`}
            onClick={handleClick}
            title="Click to edit"
            style={{width: '100%'}}
        >
        <span className="saved-text" style={{flex:1}}>{value}</span>
        {onDelete && (
            <span 
                className="delete-icon-indicator"
                onClick={(e)=> {
                    e.stopPropagation();
                    onDelete();
                }}
                title="Delete"
            >
                <svg 
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </span>
        )}
    </div>
    );
}

export default EditableInput;