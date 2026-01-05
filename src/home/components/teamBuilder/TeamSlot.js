import React from "react";

const TeamSlot = ({slotId, label,data, onClick, isSupport = false, isOptional = false, }) =>{
    //data is the specific character object for this slot

    const className = isSupport
        ? "submission-slot support-slot"
        : "submission-slot main-slot";

        return(
            <div className={className} onClick={()=> onClick(slotId)}>
                {data ? (
                    <>
                        <img 
                            src={`${data.image_url}.png`}
                            alt={label}
                            className="selected-char-img"
                        />

                        {/*Level Badge for Main Slots*/}
                        {!isSupport && data.level && data.level !== 'No' && (
                            <div className="level-badge level">Lv.{data.level}</div>
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