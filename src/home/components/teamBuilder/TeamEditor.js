import React from "react";
import TeamSlot from './TeamSlot';
import {CREW_LAYOUT} from '../../utils/teamBuilderConstants';

const TeamEditor = ({team, onTitleChange, onSlotClick}) =>{
    if(!team) return null;

    return(
        <div className="step-container">

            {/*Team Name Input */}
            <div className="input-group" style={{maxWidth: '450px', width: '100%'}}>
                <label>Team Name</label>
                    <input 
                        type="text"
                        className="modal-input glass-input"
                        value={team.title || ''}
                        onChange={(e)=> onTitleChange(e.target.value)}
                        placeholder="Enter Team Name..."
                        maxLength={30}
                    />
            </div>

            {/*Slots Grid */}
            <div className="submission-grid">
                {CREW_LAYOUT.map((slot)=> (
                    <div key={slot.mainId} className="grid-slot-wrapper">
                                                
                    {/* Main Unit */}
                    <TeamSlot
                        slotId={slot.mainId}
                        label={slot.label}
                        data={team.data[slot.mainId]}
                        onClick={onSlotClick}
                        isSupport={false}
                    />
                    <div className="mini-label">{slot.label}</div> 

                    {/*Support Character (if exists)*/}
                    {slot.hasSupport && (
                        <TeamSlot
                            slotId={slot.supportId}
                            label="support"
                            data={team.data[slot.supportId]}
                            onClick={onSlotClick}
                            isSupport={true}
                        />
                                                
                    )}
                </div>
            ))}
        </div>
    </div>
    );
};

export default TeamEditor;