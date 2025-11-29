import React, {useState} from 'react';
import './StageGuideModal.css';
import {resolveGimmick} from './GimmickData';


const GROUP_CONFIG = {
    interruption: {title: 'Interruption', className: 'interruption'},
    defeated: {title: 'On Defeat', className: 'defeated'},
    starting: {title: 'Starting State', className: 'starting'},
    preemptive: {title: 'Preemptive', className: 'preemptive'}
};

function StageGuideModal({isOpen, onClose, guideData, loading}) {
    if(!isOpen) return null;

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2> Stage Guide</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {loading && <p className="loading-text">Loading guide...</p>}
                    {!loading && !guideData && <p className="error-text"> No guide availabe for this stage yet</p>}
                    {!loading && guideData && guideData.map((battle, index) => (
                        <div key={index} className="battle-section">
                            <div className="battle-title"> Battle {battle.battle}</div>
                            <div className="gimmick-list">
                                {battle.rows.map((row,rIndex) => (
                                    <GimmickRow key ={rIndex} row={row} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function GimmickRow({ row }) {
    const [isChecked, setIsChecked] = useState(false);
    const [currentTurns, setCurrentTurns] = useState(0);

    const groupType = GROUP_CONFIG[row.type];

    if(groupType) {
        return(
            <div className={`grouped-row ${groupType.className}`}>
                <div className="group-header">
                    <span className="group-label">{groupType.title}</span>
                    {row.triggerText && <span className="trigger-text">{row.triggerText}</span>}
                </div>
                <div className= "group-body">
                    {row.subRows && row.subRows.map((sub,i) => (
                        <GimmickRow key={i} row={sub} />
                    ))}
                </div>
            </div>
        );
    }
    const {text, icon, color} = resolveGimmick(row);
    const isInteractive = color === `bg-red-900`;
    const hasTurns = row.turns && row.turns>0;
    const isCompleted = hasTurns ? (currentTurns >= row.turns): isChecked;

    const handleIncrement = (e) => {
        e.stopPropagation();
        if(currentTurns < row.turns) setCurrentTurns(prev=> prev+1);
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
                    {icon ? icon:null}
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
                                {currentTurns}/{row.turns}
                            </span>

                            <button
                                className="counter-btn plus"
                                onClick={handleIncrement}
                                disabled={currentTurns >= row.turns}
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

export default StageGuideModal;