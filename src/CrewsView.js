import {useRef, useEffect, useState } from 'react';
import CrewCard from './CrewCard';
import PlaceholderCard from './Placeholder.js';
import './CrewsView.css';
import { useResponsiveGrid } from './hooks/useResponsiveGrid.js';

const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="https:/www.w3.org/2000/svg" style={{marginRight: '8px'}}>
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)


function CrewsView({crews, onPageSizeChange, showOnlyOwned}) {
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

    if(!crews){
        return(
            <div className="crews-view" ref={gridRef}>
                {[...Array(calculatedSize || 4)].map((_,index) => (
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


    if (crews.length === 0){
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

    const targetSize = calculatedSize || 4;

    const visibleCrews = crews.slice(0,targetSize);
    
    const emptySlotsCount = Math.max(0, targetSize-visibleCrews.length);

        return (
            <div className="crews-view" ref={gridRef}>
                {visibleCrews.map((crewData) => (
                    <div key={crewData.id} className="crew-container">
                        <div className="card-wrapper">
                            <CrewCard crew={crewData} />
                            <a 
                                href={crewData.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-button">
                                    <PlayIcon/>Watch Video
                                </a>
                        </div>
                    </div>
                ))}

                {[...Array(emptySlotsCount)].map((_,index) => (
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