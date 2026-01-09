import React, {useState} from "react";
import { TrashIcon } from "../Icons";

function EditableInput({value, onSave, onDelete, placeholder, isNew= false, isHeader= false, icon = "+", maxLength}){
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
                maxLength={maxLength}
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
                <TrashIcon/>
            </span>
        )}
    </div>
    );
}

export default EditableInput;