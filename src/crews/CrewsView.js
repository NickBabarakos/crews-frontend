import {useRef, useEffect, useState, useMemo } from 'react';
import CrewCard from './CrewCard.js';
import PlaceholderCard from './Placeholder.js';
import './CrewsView.css';
import { useResponsiveGrid } from '../hooks/useResponsiveGrid.js';
import { useCollection } from '../CollectionContext.js';

const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const DocIcon = () => (
    <svg width="20" height="20" viewbox = "0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:'8px'}}>
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9H8"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const PlusIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000.svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

const AddCrewCard = ({ onClick }) => (
    <div className="crew-container add-crew-slot" onClick={onClick}>
        <div className="add-crew-card">
            <div className="plus-icon-wrapper">
                <PlusIcon/>
            </div>
            <span className="add-crew-text">Add New Crew</span>
        </div>
    </div>
)


function CrewsView({crews, onPageSizeChange, showOnlyOwned, onAddCrewClick, onOpenTextGuide, highlightedCrewId, onReport, sortBy}) {
    const gridRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const {isOwned} = useCollection();


    useEffect(()=> {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize',handleResize);
    }, []);

    const calculatedSize = useResponsiveGrid(gridRef, {
        cardWidth: isMobile ? 180: 300,
        cardHeight: 480,
        gap: isMobile ? 10:30,
        minRows: 1,
        maxRows: 1,
        widthBuffer: isMobile ? 10: 30
    });

    useEffect(()=> {
        if(calculatedSize>0 && onPageSizeChange) {
            onPageSizeChange(calculatedSize)
        }
    }, [calculatedSize, onPageSizeChange]);

    const sortedCrews = useMemo(()=> {
        if(!crews) return null;
        if (sortBy === 'default') return crews;

        const getCrewScore = (crew) => {
            if(!crew.members) return 0;
            return crew.members.reduce((acc, member) => {
                if(member.position === 'Friend Captain') return acc;
                if(member.notes && member.notes.toLowerCase().includes('optional')) return acc;
                if(member.character_id && isOwned(member.character_id)){
                    return acc+1;
                }
                return acc;
            }, 0);
        };

        return [...crews].sort((a,b) => getCrewScore(b)-getCrewScore(a));
    }, [crews, sortBy, isOwned])

    const targetSize = calculatedSize || 4;

    if(!sortedCrews){
        return(
            <div className="crews-view" ref={gridRef}>
                {[...Array(targetSize)].map((_,index) => (
                    <div key={`placeholder-${index}`} className="crew-container">
                        <div className="card-wrapper placeholder-wrapper">
                            <PlaceholderCard />
                            <div className="video-button disabled">&nbsp;</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

        if((!sortedCrews || sortedCrews.length === 0) && !showOnlyOwned){
            return(
                <div className="crews-view" ref={gridRef}>
                    <AddCrewCard onClick={onAddCrewClick} />

                        {[...Array(targetSize-1)].map((_,index)=> (
                            <div key={`placeholder-empty-${index}`} className="crew-container">
                                <div className="card-wrapper placeholder-wrapper">
                                <PlaceholderCard />
                                <div className="video-button disabled">&nbsp;</div>
                                </div>
                        </div>
                        ))}
                    </div>
            );
        }

        if((!sortedCrews || sortedCrews.length === 0) && showOnlyOwned){
            const emptyStateContent = showOnlyOwned ? {
            image: "/luffy-rayleigh.png",
            title: "The New World Awaits You!",
            text: "No crews found matching your current Character Box. Keep sailing, recruit powerful allies, and grow stronger. The path to becoming the Pirate King is long, but your adventure is just begining!"
        }:{
            image: "/crews-not-found.png",
            title: "Uncharted Waters Ahead!",
            text:"It seems you're the first pirate to explore this area. If you've conquered this challenge, help us map the way! Join our Discord server to share your crew and guide your fellow adventurers."
        };
        return(
            <div className = "no-crews-message">
                <div className="empty-state-card">
                    <img src={emptyStateContent.image} className="luffy-empty-state-image" alt="Empty State"/>
                    <h2>{emptyStateContent.title}</h2>
                    <p>
                        {emptyStateContent.text}
                    </p>
            </div>
            </div>
        );
    }

    const visibleCrews = sortedCrews.slice(0, targetSize);
    const filledSlots = visibleCrews.length;
    const remainingSlots = targetSize - filledSlots;
    const showAddButton = remainingSlots > 0 && !showOnlyOwned;
    const placeholderCount = showAddButton ? remainingSlots -1: remainingSlots;

        return (
            <div className="crews-view" ref={gridRef}>
                {visibleCrews.map((crewData) => {
                    const isHighlighted = crewData.id === highlightedCrewId;

                    return (
                    <div key={crewData.id} className="crew-container">
                        <div className={`card-wrapper ${isHighlighted ? 'highlighted-wrapper' : ''}`}>
                            <CrewCard crew={crewData} onReport={onReport}/>

                            {crewData.guide_type === 'text' ? (
                                <button
                                    className="video-button text-guide-btn"
                                    onClick={()=> onOpenTextGuide(crewData)}
                                >
                                    <DocIcon/>Text Guide
                                </button>
                            ):(
                                 <a 
                                    href={crewData.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="video-button">
                                    <PlayIcon/>Video Guide
                                </a>

                            )}
                        </div>
                    </div>
                    );
                })}

                {showAddButton && ( 
                    <AddCrewCard onClick={onAddCrewClick} /> 
                )}

                {[...Array(Math.max(0,placeholderCount))].map((_,index) => (
                    <div key={`placeholder-fill-${index}`} className="crew-container">
                        <div className="card-wrapper placeholder-wrapper">
                            <PlaceholderCard/>
                            <div className="video-button disabled">&nbsp;</div>
                        </div>
                    </div>
                ))}
                </div>
        );
}



export default CrewsView;