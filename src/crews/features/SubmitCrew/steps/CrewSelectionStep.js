import React from 'react';
import '../SubmitCrewModal.css';
import { getImageUrl } from '../../../../utils/imageUtils';
import { KeyIcon } from '../../../../components/Icons';

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

const getSlotDisplayData = (member) => {
    if(!member) return { isEmpty: true};

    const rawLevel = member.notes;
    const isLbPlus = rawLevel ? rawLevel.includes('+') : false;

    let displayLevel = rawLevel ? rawLevel.replace('+', '') : null;
    if(displayLevel === 'No' || displayLevel === '') displayLevel = null;

    const isOptionalSupport = member.notes === 'optional';

    return{
        isEmpty: false,
        imageUrl: getImageUrl(`${member.image_url}.png`),
        isLbPlus,
        displayLevel,
        isOptionalSupport
    };
};

/**
 * STEP 1: CREW SELECTION UI
 * --------------------
 * The visual grid allowing users to populate their cre slots.
 * 
 * Features: 
 * -**Data-Driven Layout:** Renders slots dynamically based on the `CREW_LAYOUT` config.
 * -**Visual Feedback:** Shows selected character images or empty state indicators ('+').
 * -**Interaction:** Delegates clicks to the parent via `onSlotClick``.
 * 
 * @param {Object} props
 * @param {Object} props.crewData - Dictionary storing selected characters { [slotId]: charData }.
 * @param {Function} props.onSlotClick - Handler when a slot is clicked (triggers selection modal).
 * @param {'video' | 'text'} props.guideType - Current mode for the guide (Video vs Text).
 * @param {Function} props.setGuideType - State setter to toggle between Video and Text mode.
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
                {CREW_LAYOUT.map((slot)=> {
                    const mainData = getSlotDisplayData(crewData[slot.mainId]);

                    return(
                    <div key={slot.mainId} className="grid-slot-wrapper">
                        {/*--- MAIN SLOT ---*/}
                        <div 
                            className="submission-slot main-slot"
                            onClick={()=> onSlotClick(slot.mainId)}
                        > 
                            {!mainData.isEmpty ? (
                                <>
                                    <img 
                                        src={mainData.imageUrl}
                                        alt="Selected"
                                        className="selected-char-img"
                                    />

                                    {mainData.isLbPlus && (
                                        <div className="lb-key-icon">
                                            <KeyIcon/>
                                        </div>
                                    )}
                                    {mainData.displayLevel && (
                                        <div className="level-badge level">
                                            <span className="lv-label">Lv.</span>
                                            <span className="lv-num small">{mainData.displayLevel}</span>
                                        </div>    
                                    )}
                                </>
                                               
                                ):( 
                                    <div className="empty-slot-indicator">+</div>
                                )}

                        </div>

                        <div className="mini-label">{slot.label}</div>
                        
                        {/*--- SUPPORT SLOT ---*/}
                            {slot.hasSupport && (
                                (()=>{
                                    const supportData = getSlotDisplayData(crewData[slot.supportId]);
                                    return(
                                        <div 
                                            className="submission-slot support-slot"
                                            onClick={()=>onSlotClick(slot.supportId)}
                                        >
                                        {!supportData.isEmpty ? (
                                        <>
                                            <img
                                                src={supportData.imageUrl}
                                                alt="Sup"
                                                className="selected-char-img"
                                            />
                                                {supportData.isOptionalSupport && (
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
                                    );
                                    })()
                                )}
                                    </div>
                                );
                                    })}
                            </div>

                            <p className="hint-text">Click on a slot to select characters. Don't forget supports!</p>
                        </div>
    );
}

export default CrewSelectionStep;