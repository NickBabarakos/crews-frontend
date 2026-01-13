import React, {useState} from 'react';
import CharacterSelector from '../../crews/features/SubmitCrew/CharacterSelector';
import CharacterDetailsView from '../../crews/features/SubmitCrew/CharacterDetailsView';
import { getImageUrl } from '../../utils/imageUtils';
import { KeyIcon } from '../../components/Icons';

const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];

function CrewLayoutGrid({members, setMembers}) {
    const [editingSlot, setEditingSlot] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);

    const renderMainSlotBadges = (member) => {
        if(!member) return null;

        const rawNotes = member.notes;
        const isLbPlus = rawNotes ? rawNotes.includes('+') : false;

        let displayLevel = null;
        if(rawNotes && rawNotes !== 'optional'){
            displayLevel = rawNotes.replace('+', '');
        }

        return(
            <>
                {displayLevel && displayLevel !== 'No' && (
                    <div className="level-badge">Lv.{displayLevel}</div>
                )}
                {isLbPlus && (
                    <div className="lb-key-icon">
                        <KeyIcon width="14" height="14"/>
                    </div>
                )}
            </>
        );
    };

    const handleSlotClick = (slotId) => {
        setEditingSlot(slotId);
        setSelectedChar(null);
    };

    if(editingSlot){
        if(selectedChar){
            return(
                <div className="members-section">
                    <CharacterDetailsView
                        character={selectedChar}
                        isSupport={editingSlot.includes('Support')}
                        onConfirm={(details) => {
                            setMembers(prev => ({...prev, [editingSlot]: {...selectedChar, ...details}}));
                            setSelectedChar(null);
                            setEditingSlot(null);
                        }}
                        onBack={()=> setSelectedChar(null)}
                    />
                </div>
            );
        } else {
            //Δειχνουμε τη λιστα για να διαλεξει χαρακτηρα
            return(
                <div className="members-section">
                    <CharacterSelector
                        onSelect={(char) => setSelectedChar(char)}
                        onBack={()=> setEditingSlot(null)}
                    />
                </div>
            );
        }
    }

    //Default View: Το Grid
    return(
         <div className="members-section admin-visual-members">
            <h4 className="section-title">Crew Layout </h4>

                <div className="submission-grid">
                    {CREW_LAYOUT.map((slot) => (
                        <div key={slot.mainId} className="grid-slot-wrapper">
                            {/*MAIN SLOT */}
                            <div className="submission-slot main-slot" onClick={()=> handleSlotClick(slot.mainId)}>
                                {members[slot.mainId] ? (
                                    <>
                                        <img src = {getImageUrl(`${members[slot.mainId].image_url}.png`)} alt="char" className="selected-char-img" />
                                        {renderMainSlotBadges(members[slot.mainId])}
                                    </>
                                ): <div className="empty-slot-indicator">+</div>}
                            </div>
                            <div className="mini-label">{slot.label}</div>

                            {/* SUPPORT SLOT */}
                            {slot.hasSupport && (
                                <div className="submission-slot support-slot" onClick={()=> handleSlotClick(slot.supportId)}>
                                    {members[slot.supportId] ? (
                                        <>
                                            <img src={getImageUrl(`${members[slot.supportId].image_url}.png`)} alt="sup" className="selected-char-img" />
                                            {members[slot.supportId].notes === 'optional' && <div className="optional-indicator">!</div>}
                                        </>
                                    ): <div className="empty-slot-indicator small">+</div>}
                                </div>
                            )}
                        </div> 
                    ))}
                </div> 
            </div>
    );
}

export default CrewLayoutGrid;