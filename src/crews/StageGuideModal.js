import React, {useState} from 'react';
import './StageGuideModal.css';

import atkDownIcon from '../assets/gimmicks/atk-down.png';
import enrageIcon from '../assets/gimmicks/enrage.png';
import nnadIcon from '../assets/gimmicks/NNAD.png';
import chainGrowthDownIcon from '../assets/gimmicks/chain-growth-down.png';
import defUpIcon from '../assets/gimmicks/increased-defense.png';
import resilienceIcon from '../assets/gimmicks/resilience.png';
import immunityDefeatIcon from '../assets/gimmicks/immunity-instant-defeat.png';
import immunityStatusIcon from '../assets/gimmicks/immunity-status-effects.png';
import intimidationIcon from '../assets/gimmicks/intimidation.png';
import burnIcon from '../assets/gimmicks/burn.png';
import specialLimitIcon from '../assets/gimmicks/special-limit.png';
import immunityIcon from '../assets/gimmicks/immunity.png';
import painIcon from '../assets/gimmicks/pain.png';
import thresholdIcon from '../assets/gimmicks/threshold.png';
import percentageDamageResistanceIcon from '../assets/gimmicks/percentage-damage-resistance.png';
import endOfTurnDamageIcon from '../assets/gimmicks/end-of-turn-damage.png';
import lockTargetIcon from '../assets/gimmicks/lock-target.png';
import delayImmunitIcon from '../assets/gimmicks/immunity-delay.png';
import percentageReductionIcon from '../assets/gimmicks/percentage-reduction.png';
import hungerIcon from '../assets/gimmicks/hunger.png';
import limitedTapsIcon from '../assets/gimmicks/limited-taps.png';
import chainAtkDownIcon from '../assets/gimmicks/chain-atk-down.png';
import damagaNullificationIcon from '../assets/gimmicks/damage-nullification.png';
import slotDamageReductionIcon from '../assets/gimmicks/slot-damage-reduction.png';
import chainBoundryAtkDownIcon from '../assets/gimmicks/chain-boundry-atk-down.png';
import poisonIcon from '../assets/gimmicks/poison.png';
import toxicIcon from '../assets/gimmicks/toxic.png';
import increasedDamageTakenIcon from '../assets/gimmicks/increased-damage-taken.png';
import specialChargeIcon from '../assets/gimmicks/special-charge.png';
import specialReverseIcon from '../assets/gimmicks/special-reverse.png';
import specialBindIcon from '../assets/gimmicks/special-bind.png';

const ICON_MAP ={
    'atk_down': atkDownIcon,
    'enrage': enrageIcon,
    'nnad' : nnadIcon,
    'chain_growth_down': chainGrowthDownIcon,
    'def_up': defUpIcon,
    'resilience' : resilienceIcon,
    'immunity_defeat': immunityDefeatIcon,
    'immunity_status': immunityStatusIcon,
    'intimidation': intimidationIcon,
    'burn': burnIcon,
    'special_limit': specialLimitIcon,
    'immunity':immunityIcon,
    'pain': painIcon,
    'threshold': thresholdIcon,
    'percentage_damage_resistance' : percentageDamageResistanceIcon,
    'end_of_turn_damage': endOfTurnDamageIcon,
    'lock_target': lockTargetIcon,
    'delay_immunity': delayImmunitIcon,
    'percentage_reduction' : percentageReductionIcon,
    'hunger': hungerIcon,
    'limited_taps': limitedTapsIcon,
    'chain_atk_down': chainAtkDownIcon,
    'damage_nullification': damagaNullificationIcon,
    'slot_damage': slotDamageReductionIcon,
    'chain_boundary': chainBoundryAtkDownIcon,
    'poison': poisonIcon,
    'toxic': toxicIcon,
    'increased_damage_taken': increasedDamageTakenIcon,
    'special_charge' : specialChargeIcon,
    'special_reverse': specialReverseIcon,
    'special_bind' : specialBindIcon,
    'default': null
};

const GROUP_CONFIG = {
    interruption: {title: 'Interruption', className: 'interruption'},
    defeated: {title: 'On Defeat', className: 'defeated'},
    starting: {title: 'Starting State', className: 'starting'},
    preemptive: {title: 'Preemptive', className: 'preemptive'},
    group: {title: 'Group', className: 'group'}
};

function StageGuideModal({isOpen, onClose, guideData, loading}) {
    if(!isOpen) return null;
    let processedData = guideData;

   
    if(typeof processedData === 'string'){
        try{
            processedData = JSON.parse(processedData);
        } catch(e) {
            console.error("Error parsing guideData JSON:", e);
            processedData = null;
        }
    }

    const battles = processedData?.battles || [];
    const conditions = processedData?.conditions || [];

     console.log("Conditions are:", conditions);

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

                    {!loading && conditions.length >0 && (
                        <div className="stage-conditions">
                            <div className="conditions-header">
                                <span className="info-icon">i</span> Stage Conditions
                            </div>
                            <ul className="conditions-list">
                                {conditions.map((cond, idx) => (
                                    <li key={idx} className="condition-item">
                                        {cond}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {!loading && battles && battles.map((battle, index) => (
                        <div key={index} className="battle-section">
                            <div className="battle-title"> Battle {battle.battle}</div>
                            <div className="gimmick-list">
                                {battle.rows && battle.rows.map((row,rIndex) => (
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
    const {text, color, tracker} = row;
    const icon = row.icon ? ICON_MAP[row.icon] : null;
    const hasTurns = typeof tracker === 'number';
    const isInteractive = tracker !== null;
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

export default StageGuideModal;