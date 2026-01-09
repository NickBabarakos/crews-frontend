import {useRef, useEffect, useState} from 'react';
import CrewCard from '../cards/CrewCard.js';
import PlaceholderCard from '../cards/Placeholder.js';
import './CrewsView.css';
import { useResponsiveGrid } from '../../../hooks/useResponsiveGrid.js';
import EmptyCrewState from '../listing/EmptyCrewState.js';
import { PlayIcon, DocIcon, PlusIcon } from '../../../components/Icons.js';



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
/**
 * CREWS GRID VIEW
 * ---------------
 * Renders the list of CrewCards in a responsive grid layout.
 * 
 * Key Features:
 * 1. Responsive Calculation: Uses `useResponsiveGrid` to determine how many cards fit per row.
 * 2. Placeholders: Renders empty slots to maintain grid structure when loading or filling space.
 * 3. Deep Linking Scroll: Automatically scrolls to `highlightedCrewId` if present in URL.
 */

function CrewsView({crews, onPageSizeChange, showOnlyOwned, onAddCrewClick, onOpenTextGuide, highlightedCrewId, onReport, sortBy}) {
    const gridRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


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

    
    const sortedCrews = crews;

    const targetSize = calculatedSize || 4;

    // EFFECT: Scroll to specific crew (Deep Link)
    useEffect(()=> {
        if(highlightedCrewId && sortedCrews && sortedCrews.length > 0){
            const attemptScroll = (attempts = 0) => {
                const element = document.getElementById(`crew-${highlightedCrewId}`);
                if(element){
                    element.scrollIntoView({behavior: 'smooth', block: 'center'});
                } else if (attempts < 10){
                    setTimeout(() => attemptScroll(attempts +1), 300);
                }
            };

            setTimeout(()=> attemptScroll(), 100);
        }
    }, [highlightedCrewId, sortedCrews]);

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
        return <EmptyCrewState showOnlyOwned={showOnlyOwned}/>
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
                    <div key={crewData.id} id={`crew-${crewData.id}`} className="crew-container">
                        <div className={`card-wrapper ${isHighlighted ? 'highlighted-wrapper' : ''}`}>
                            <CrewCard crew={crewData} onReport={onReport}/>

                            {crewData.guide_type === 'text' ? (
                                <button
                                    className="video-button text-guide-btn"
                                    onClick={()=> onOpenTextGuide(crewData)}
                                >
                                    <DocIcon style={{marginRight: '8px'}}/>Text Guide
                                </button>
                            ):(
                                 <a 
                                    href={crewData.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="video-button">
                                    <PlayIcon style={{marginRight: '8px'}}/>Video Guide
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