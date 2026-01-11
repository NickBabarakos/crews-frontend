import React from 'react';
import '../SubmitCrewModal.css';
import { getImageUrl } from '../../../../utils/imageUtils';

//STATIC CONFIG: Defines the visual layout of the 6-man team + supports.
// Used to iterate and render slots dynamically instead of hardcoding HTML.
const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];

/**
 * STEP 1: TEAM BUILDER
 * --------------------
 * The interactive grid where users select their team members.
 * 
 * Logic:
 * - Iterates through CREW_LAYOUT to render clickable slots.
 * - Visualizes selected characters (images) or Empty statles (+)
 * - Handles distinct logic for Main Units vs Support Units.
 */
function CrewSelectionStep({crewData, onSlotClick, guideType, setGuideType}){
    return(
         <div className="step-container">
            <div className="guide-type-selector">
                <button
                    className={`type-btn ${guideType === 'video' ? 'active' : ''}`}
                    onClick={()=> setGuideType('video')}
                >Video Guide</button>

                <button
                    className={`type-btn ${guideType === 'text' ? 'active' : ''}`}
                    onClick={()=> setGuideType('text')}
                >Text guide</button>
            </div>

            <div className="submission-grid">
                {CREW_LAYOUT.map((slot)=> (
                    <div key={slot.mainId} className="grid-slot-wrapper">
                        <div 
                            className="submission-slot main-slot"
                            onClick={()=> onSlotClick(slot.mainId)}
                        > 
                            {crewData[slot.mainId] ? (
                                <>
                                    <img 
                                        src={getImageUrl(`${crewData[slot.mainId].image_url}.png`)}
                                        alt="Selected"
                                        className="selected-char-img"
                                    />
                                        {crewData[slot.mainId].level && crewData[slot.mainId].level !== 'No' && (
                                            <div className="level-badge level">Lv.{crewData[slot.mainId].level}</div>    
                                        )}
                                </>
                                               
                                ):( 
                                    <div className="empty-slot-indicator">+</div>
                                    )}

                        </div>

                        <div className="mini-label">{slot.label}</div>

                            {slot.hasSupport && (
                                <div 
                                    className="submission-slot support-slot"
                                    onClick={()=>onSlotClick(slot.supportId)}
                                >
                                    {crewData[slot.supportId] ? (
                                        <>
                                            <img
                                                src={getImageUrl(`${crewData[slot.supportId].image_url}.png`)}
                                                alt="Sup"
                                                className="selected-char-img"
                                            />
                                                {crewData[slot.supportId].supportType === 'optional' && (
                                                    <div className="optional-indicator">
                                                        !
                                                        <span className="tooltip-text">Optional Support </span>
                                                    </div>
                                                )}
                                                </>
                                            ):(
                                                <div className="empty-slot-indicator small">+</div>
                                            )}
                                        </div>
                                    )}
                                    </div>
                                ))}
                            </div>

                            <p className="hint-text">Click on a slot to select characters. Don't forget supports!</p>
                        </div>
    );
}

export default CrewSelectionStep;