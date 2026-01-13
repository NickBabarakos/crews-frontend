import React from "react";
import { getImageUrl } from "../../../utils/imageUtils";
import { KeyIcon } from "../../../components/Icons";

const TeamSlot = ({slotId, label,data, onClick, isSupport = false, isOptional = false, }) =>{
    //data is the specific character object for this slot

    const className = isSupport
        ? "submission-slot support-slot"
        : "submission-slot main-slot";

        const rawNotes = data?.notes;
        const isLbPlus = rawNotes ? rawNotes.includes('+') : false;
        let displayLevel = null;

        if(rawNotes && rawNotes !== 'optional'){
            displayLevel = rawNotes.replace('+', '');
        }

        return(
            <div className={className} onClick={()=> onClick(slotId)}>
                {data ? (
                    <>
                        <img 
                            src={getImageUrl(`${data.image_url}.png`)}
                            alt={label}
                            className="selected-char-img"
                        />

                        {/*Level Badge for Main Slots*/}
                        {!isSupport && displayLevel && displayLevel !== 'No' && (
                            <div className="level-badge level">
                                 <span className="lv-label step">Lv.</span>
                                <span className="lv-num step">{displayLevel}</span>
                            </div>
                        )}

                        {/*LB+ Key Icon */}
                        {isLbPlus && (
                            <div className="lb-key-icon">
                                <KeyIcon width="18" height="18"/>
                            </div>
                        )}

                        {/*Optional Indicator for Support Slots */}
                        {isSupport && data.supportType === 'optional' && (
                            <div className="optional-indicator">!</div>
                        )}
                    </>
                ):(
                    <div className={`empty-slot-indicator ${isSupport ? 'small' : ''}`}>+</div>
                )}
            </div>
        );
};

export default TeamSlot;