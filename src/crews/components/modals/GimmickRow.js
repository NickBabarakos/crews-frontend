import React, {useState} from 'react';
import { getIcon, getGroupConfig } from '../../utils/stageGuideUtils';

/**
 * GIMMICK ITEM COMPONENT
 * ----------------------
 * Renders a single line of a Stage Guide (e.g. "ARK Down 5 turns")
 * 
 * Features:
 * 1. Recursive Rendering: Can render a "Group" of gimmicks (e.g., "On Death" triggers)
 * 2. Interactive Trackers:
 *  - Checkboxes for simple gimmicks.
 *  - Turn Counters (+/-) for duration-based gimmicks
 */
function GimmickRow({row}){
    const [isChecked, setIsChecked ] = useState(false);
    const [currentTurns, setCurrentTurns] = useState(0);
    const groupType = getGroupConfig(row.type);

    // CASE A: It's a Group (Recursive Render)
    if(groupType){
        return(
            <div className={`grouped-row ${groupType.className}`}>
                {row.type !== 'group' && (
                <div className="group-header">
                    <span className="group-label">{groupType.title}</span>
                    {row.triggerText && <span className="trigger-text">{row.triggerText}</span>}
                </div>
                )}
                <div className= "group-body">
                    {row.subRows && row.subRows.map((sub,i) => (
                        <GimmickRow key={i} row={sub} />
                    ))}
                </div>
            </div>
        );
    }

    // CASE B: Standard Gimmick Row
    const {text, color, tracker} = row;
    const icon = row.icon ? getIcon(row.icon) : null;
    const hasTurns = typeof tracker === 'number';
    const isInteractive = tracker !== null;
    // Logic: Mark as completed if turns reached requirement OR checkbox ticked
    const isCompleted = hasTurns ? (currentTurns >= tracker) : isChecked;

    const handleIncrement = (e) => {
        e.stopPropagation();
        if(currentTurns < tracker) setCurrentTurns(prev=> prev+1);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        if(currentTurns >0) setCurrentTurns(prev => prev-1);;
    };

    const handleToggleCheck = ()=> {
            setIsChecked(!isChecked);
    };


    return (
        <div 
            className={`gimmick-item ${color} ${isCompleted ? 'gimmick-completed ' : ''}`}
            onClick={(!hasTurns && isInteractive) ? handleToggleCheck : undefined}
            style={{cursor: (!hasTurns && isInteractive) ? 'pointer' : 'default'}}
        >
            <div className="gimmick-content-left">
                <div className={`icon-wrapper ${icon ? 'has-icon' : ''}`}>
                    {icon ? <img src={icon} alt="" className="gimmick-img" /> : null}
                </div>
                <div className="gimmick-text">{text}</div>
            </div>
            {isInteractive && (
                <div className="gimmick-controls" onClick ={(e) => e.stopPropagation()}>
                    {hasTurns ? (
                        <div className="turn-counter">
                            <button
                                className="counter-btn minus"
                                onClick={handleDecrement}
                                disabled={currentTurns === 0}
                            >-</button>

                            <span className="counter-display">
                                {currentTurns}/{tracker}
                            </span>

                            <button
                                className="counter-btn plus"
                                onClick={handleIncrement}
                                disabled={currentTurns >= tracker}
                            >+</button>
                        </div>
                    ):(
                        <div className={`checkbox-custom ${isChecked ? 'checked' : ''}`} onClick={handleToggleCheck}>
                            {isChecked && <span>&#10003;</span>}
                        </div>
                    )}
                </div>
            )}
    </div>
);       
}

export default GimmickRow;