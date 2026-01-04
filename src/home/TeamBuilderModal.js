import React, {useState, useRef, useEffect} from "react";
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import toast, {Toaster} from 'react-hot-toast';

import "../crews/features/SubmitCrew/SubmitCrewModal.css";
import './TeamBuilderModal.css';
import CharacterSelector from "../crews/features/SubmitCrew/CharacterSelector";
import CrewCard from "../crews/components/cards/CrewCard";
import CharacterDetailsView from "../crews/features/SubmitCrew/CharacterDetailsView";

const CREW_LAYOUT = [
    { mainId: 'Friend Captain', label: 'Friend Captain', hasSupport: false},
    { mainId: 'Captain', label: 'Captain', hasSupport: true, supportId: 'Support Captain'},
    { mainId: 'Crewmate4', label: 'Crewmate 4', hasSupport: true, supportId: 'Support4'},
    { mainId: 'Crewmate1', label: 'Crewmate 1', hasSupport: true, supportId: 'Support1'},
    { mainId: 'Crewmate3', label: 'Crewmate 3', hasSupport: true, supportId: 'Support3'},
    { mainId: 'Crewmate2', label: 'Crewmate 2', hasSupport: true, supportId: 'Support2'}
];


const INITIAL_SLOT_STATE = {
    'Friend Captain': null,
    'Captain': null,
    'Support Captain': null,
    'Crewmate1': null, 'Support1': null,
    'Crewmate2': null, 'Support2': null,
    'Crewmate3': null, 'Support3': null,
    'Crewmate4': null, 'Support4': null
};

function TeamBuilderModal({isOpen, onClose}){
    const [step, setStep] = useState(1);
    const [teamCount, setTeamCount] = useState(1);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [teams, setTeams] = useState([]);
    const [editingSlot, setEditingSlot] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const exportRef = useRef(null);

    useEffect(()=> {
        if(!isOpen){
            setStep(1);
            setTeamCount(1);
            setTeams([]);
            setCurrentTeamIndex(0);
            setEditingSlot(null);
            setSelectedChar(null);
        }
    }, [isOpen]);

    const handleQuantitySelect = (count) => {
        setTeamCount(count);
        const newTeams = Array(count).fill(null).map((_,index) => ({
            id: index,
            title: `Team ${index+1} Name`,
            data: {...INITIAL_SLOT_STATE}
        }));
        setTeams(newTeams);
        setStep(2);
    };

    const handleSlotClick = (slotId) => {
        setEditingSlot(slotId);
        setSelectedChar(null);
    };

    const handleCharacterSelect = (char) => {
        setSelectedChar(char);
    };

    const handleDetailsConfirm = (details) => {
        const updatedTeams = [...teams];
        updatedTeams[currentTeamIndex] = {
            ...updatedTeams[currentTeamIndex],
            data:{
            ...updatedTeams[currentTeamIndex].data,
            [editingSlot]: {...selectedChar, ...details }
        }
    };
    setTeams(updatedTeams);
    setSelectedChar(null);
    setEditingSlot(null);
    };

    const handleTitleChange = (newTitle) => {
        const updatedTeams = [...teams];
        updatedTeams[currentTeamIndex].title = newTitle;
        setTeams(updatedTeams);
    };

    const handleNext = () => {
        if(!teams[currentTeamIndex].data['Captain']){
            toast.error("Please select at least a Captain for this team.");
            return;
        }

        if(currentTeamIndex < teamCount-1){
            setCurrentTeamIndex(prev => prev+1);
        } else{
            handleExport();
        }
    };

    const handleBack = () => {
        if(selectedChar){
            setSelectedChar(null);
        } else if (editingSlot) {
            setEditingSlot(null);
        } else if (currentTeamIndex > 0){
            setCurrentTeamIndex(prev=>prev-1);
        } else {
            setStep(1);
        }
    };

    const handleExport = async () => {
        if(isExporting) return;
        setIsExporting(true);
        const toastId = toast.loading('Generating Image...');

        try{
            await new Promise(resolve => setTimeout(resolve, 300));

            const element = exportRef.current;
            if(!element) throw new Error('Export container not found');

            const images = Array.from(element.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if(img.complete) return Promise.resolve();
                return new Promise((resolve)=> {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            try{
                await Promise.all(images.map(img => img.decode().catch(()=> {})));
            } catch (e) { console.log('Image decode skipped');}


            const dataUrl = await toPng(element, {
                    pixelRatio: 2,
                    backgroundColor: 'var(--bg-surface)',
                    style: {
                        opacity: '1',
                        transform: 'none',
                        zIndex: 'auto'
                    },
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    useCORS: true,
                    cacheBust: false
            });

            download(dataUrl, `OPTC-Teams-Export-${Date.now()}.png`);
            toast.success('Image Saved!', {id: toastId});
            onClose();

        } catch(error){
            console.error('Export failed', error);
            toast.error('Failed to generate image', {id: toastId});
        }finally{
            setIsExporting(false);
        }
    };

    const transformDataForCard = (teamDataMap, title) => {
        const members = [];
        Object.keys(teamDataMap).forEach(key => {
            if(teamDataMap[key]){
                const level = teamDataMap[key].level;
                const finalNotes = (level && level !=='No') ? level : (teamDataMap[key].supportType || null);

                members.push({
                    position: key,
                    character_id: teamDataMap[key].id,
                    ...teamDataMap[key],
                    notes: finalNotes
                });
            }
        });
        return{
            id: 'export-preview',
            title: title,
            members: members
        };
    };

    if(!isOpen) return null;

    const currentTeamData = teams[currentTeamIndex]?.data || {};

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="submit-modal-content" onClick={e => e.stopPropagation()}>
                {!editingSlot && (
                    <div className="modal-header">
                        <div className="header-title-group">
                            <span className="header-prefix">Team Builder</span>
                            <h2 className="header-stage-name">
                                {step === 1 ? 'Select Quantity' : `Editing Team ${currentTeamIndex + 1} of ${teamCount}`}
                            </h2>
                        </div>
                        <button className="close-btn" onClick={onClose}>&times;</button>
                    </div>
                )}

                <div className="modal-body">
                    {step === 1 && (
                        <div className="step-container center-content">
                            <h3 style={{color: 'var(--text-main)', marginBottom: '10px'}}>How many teams do you want to build? </h3>
                            <p className="hint-text" style={{marginBottom: '30px', textAlign: 'center'}}>
                                You can build and export up to 4 teams in a single image.
                            </p>

                            <div className="quantity-grid">
                                {[1,2,3,4].map(num => (
                                    <button
                                        key={num}
                                        className="quantity-btn"
                                        onClick={()=>handleQuantitySelect(num)}
                                    >
                                        <span className="qty-num">{num}</span>
                                        <span className="qty-label">{num === 1 ? 'Team' : 'Teams'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        editingSlot ? (
                            selectedChar ? (
                                <div className="step-container">
                                    <CharacterDetailsView
                                        character={selectedChar}
                                        isSupport={editingSlot.includes('Support') || editingSlot === 'Support Captain'}
                                        onConfirm={handleDetailsConfirm}
                                        onBack={()=> setSelectedChar(null)}
                                    />
                                </div>
                            ):(
                                <CharacterSelector 
                                    onSelect={handleCharacterSelect}
                                    onBack={handleBack}
                                />
                        )
                        ): (
                            <div className="step-container">
                                <div className="input-group" style={{maxWidth: '450px', width: '100%'}}>
                                    <label>Team Name</label>
                                        <input 
                                            type="text"
                                            className="modal-input glass-input"
                                            value={teams[currentTeamIndex]?.title || ''}
                                            onChange={(e)=> handleTitleChange(e.target.value)}
                                            placeholder="Enter Team Name..."
                                            maxLength={30}
                                        />
                                    </div>

                                    <div className="submission-grid">
                                        {CREW_LAYOUT.map((slot)=> (
                                            <div key={slot.mainId} className="grid-slot-wrapper">
                                                <div 
                                                    className="submission-slot main-slot"
                                                    onClick={()=> handleSlotClick(slot.mainId)}
                                                >
                                                    {currentTeamData[slot.mainId] ? (
                                                        <>
                                                            <img 
                                                                src={`${currentTeamData[slot.mainId].image_url}.png`}
                                                                alt="Selected"
                                                                className="selected-char-img"
                                                            />
                                                            {currentTeamData[slot.mainId].level && currentTeamData[slot.mainId].level !== 'No' && (
                                                                <div className="level-badge level">Lv.{currentTeamData[slot.mainId].level}</div>
                                                            )}
                                                        </>
                                                    ): <div className="empty-slot-indicator">+</div>
                                                    }
                                                </div>
                                            <div className="mini-label">{slot.label}</div>

                                            {slot.hasSupport && (
                                                <div 
                                                    className="submission-slot support-slot"
                                                    onClick={()=> handleSlotClick(slot.supportId)}
                                                >
                                                    {currentTeamData[slot.supportId] ?(
                                                        <>
                                                            <img
                                                                src={`${currentTeamData[slot.supportId].image_url}.png`}
                                                                alt="Sup"
                                                                className="selected-char-img"
                                                            />
                                                            {currentTeamData[slot.supportId].supportType === 'optional' && (
                                                                <div className="optional-indicator">!</div>
                                                            )}
                                                        </>
                                                    ): <div className="empty-slot-indicator small">+</div>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {step === 2 && !editingSlot && (
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={handleBack}>
                            {currentTeamIndex === 0 ? 'Back to Selection' : 'Previous Team'}
                        </button>
                        <button className="next-btn" onClick={handleNext} disabled={isExporting}>
                            {isExporting ? 'Exporting...' : (currentTeamIndex === teamCount -1 ? 'Export Image' : 'Next Team')}
                        </button>
                    </div>
                )}
            </div>

            <div 
                ref={exportRef}
                className="export-container"
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    zIndex: '-1000',
                    opacity: '0',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: teamCount === 1 ? '550px' : '950px',
                    padding: '40px',
                    background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card) 100%)',
                    gap: '20px'
                }}
            >
                <div style={
                    {width: '100%', 
                    textAlign: 'center', 
                    marginBottom: '10px', 
                    color: 'var(--text-muted)', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase', 
                    letterSpacing: '4px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                    Team Builder
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '30px',
                    width: '100%'
                }}>

                {teams.map((team, idx) => (
                    <div key={idx} style={{display: 'flex', transformOrigin: 'center'}}>
                        <CrewCard 
                            crew={transformDataForCard(team.data, team.title)}
                            exportMode={true}
                        />
                    </div>
                ))}
                </div>

                <div style={{
                    width: '100%', 
                    textAlign: 'right', 
                    marginTop: '10px', 
                    color: 'var(--text-500)', 
                    fontStyle:'italic',
                    fontSize: '0.9rem',
                    opacity: 0.8
                }}>
                    Generated by OPTC-Crews
                </div>
            </div>
        </div>
    );
}

export default TeamBuilderModal;