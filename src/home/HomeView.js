import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeView.css';
import DataTransferModal from '../components/modals/DataTransferModal';
import TeamBuilderModal from './TeamBuilderModal';
import { getHomeStats, getActiveEvents, getLatestUnits, getChangelog } from '../api/homeService';
import { useEventTimer } from '../hooks/useEventTimer';


const MissionIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 2a1 1 0 0 0-1 1v1.001c-.961.014-1.34.129-1.721.333a2.272 2.272 0 0 0-.945.945C3.116 5.686 3 6.09 3 7.205v10.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h11.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926V7.205c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C19.34 4.13 18.961 4.015 18 4V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1zM5 9v8.795c0 .427.019.694.049.849.012.06.017.074.049.134a.275.275 0 0 0 .124.125c.06.031.073.036.134.048.155.03.422.049.849.049h11.59c.427 0 .694-.019.849-.049a.353.353 0 0 0 .134-.049.275.275 0 0 0 .125-.124.353.353 0 0 0 .048-.134c.03-.155.049-.422.049-.849L19.004 9H5zm8.75 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5z" fill="currentColor"></path>
    </svg>
);

const StarIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path>
    </svg>
);

const LogIcon = () => (
     <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M 10 4 C 8.355 4 7 5.355 7 7 L 7 21 L 4 21 L 4 25 C 4 26.645 5.355 28 7 28 L 21 28 L 21.03125 28 C 22.66025 27.984 24 26.633 24 25 L 24 11 L 28 11 L 28 7 C 28 5.355 26.645 4 25 4 L 10 4 z M 10 6 L 22.1875 6 C 22.0745 6.316 22 6.648 22 7 L 22 25 C 22 25.566 21.566 26 21 26 C 20.437 26.008 20.008 25.562 20 25 L 19.96875 21 L 9 21 L 9 7 C 9 6.434 9.434 6 10 6 z M 25 6 C 25.566 6 26 6.434 26 7 L 26 9 L 24 9 L 24 7 C 24 6.434 24.434 6 25 6 z M 6 23 L 14 23 L 17.96875 23 L 18 23 L 18 25 L 18 25.03125 C 18.004 25.37525 18.0745 25.691 18.1875 26 L 7 26 C 6.434 26 6 25.566 6 25 L 6 23 z"></path>
    </svg>
);

const TimerIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M10 3H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
        <path d="M12 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);

const EventRow = ({event, onClick}) => {
    const {status, countdown, progress} = useEventTimer(event.start_time, event.end_time);
    if(status==='ended') return null;

    return(
        <div 
            className={`event-row ${status}`}
            onClick={()=> onClick(event.mode)}
            style={{cursor: event.mode ? 'pointer' : 'default'}}
        >
            {status === 'active' && (
                <div 
                    className="event-progress-bar"
                    style={{width: `${100-progress}%`}}
                ></div> 
            )}

            <div className="event-info">
                <span className="event-name">{event.name}</span>
            </div>

            <div className="event-timer">
                <TimerIcon/>
                <span>
                    {status === 'upcoming' ? `Starts in: ${countdown}` : countdown}
                </span>
            </div>
        </div>
    );
};

function HomeView() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalCrews: 0});
    const [events, setEvents] = useState([]);
    const [latestUnits, setLatestUnits] = useState([]);
    const [changelog, setChangelog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChangelog, setActiveChangelog] = useState(null);
    const [isTransferModalOepn, setIsTransferModalOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [eventTab, setEventTab] = useState('game');
    
    const filteredEvents = useMemo(()=> {
        if(eventTab === 'game'){
            return events.filter(e=> e.mode !== 'other');
        } else {
            return events.filter(e=> e.mode === 'other');
        }
    }, [events, eventTab]);

    useEffect(()=> {
        const fetchData = async () => {
            try{
                const [statsRes, eventsRes, unitsRes, logRes] = await Promise.all([
                    getHomeStats(),
                    getActiveEvents(),
                    getLatestUnits(),
                    getChangelog()
                ]);

                setStats(statsRes);
                setEvents(eventsRes);
                setLatestUnits(unitsRes);
                setChangelog(logRes);
            } catch (error){
                console.error("Failed to load home data", error);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    

    const handleEventClick = (mode) => {
        if(!mode) return;
        let targetView = 'grandVoyage';

        switch(mode) {
            case 'kizuna_clash' : targetView = 'kizunaClash'; break;
            case 'treasure_map' : targetView = 'treasureMap'; break;
            case 'coliseum': targetView = 'coliseum'; break;
            case 'pirate_king_adventures': targetView = 'pirateKingAdventures'; break;
            case 'grand_voyage': targetView = 'grandVoyage'; break;
            case 'garp_challenge': targetView = 'garpChallenge'; break;
            case 'forest_of_training': targetView = 'forestOfTraining'; break;
            default: targetView = 'grandVoyage';
        }
        navigate(`/${targetView}`);
    };

    if(loading) return <div className="home-loader">Loading HQ Data...</div>

    return(
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content-wrapper">

                    <div className="live-badge">
                        <span className="live-pulse-dot"></span>
                        <span>{stats.totalCrews} Crews Sailing Currently</span>
                    </div>

                    <h1 className="hero-title">
                        The Ultimate Tool for <br/> 
                        <span className="text-gradient">Aspiring Crew Captains</span>
                    </h1>
                    <p className="hero-subtitle">
                        Enter the High Seas! Find and Share Crews with Other Players.
                    </p>

                    <div className="hero-actions">
                        <button className="cta-btn primary" onClick={()=> setIsBuilderOpen(true)}>
                            Build a Team
                        </button>
                        <button className="cta-btn secondary" onClick={()=> setIsTransferModalOpen(true)}>
                            Sync Box
                        </button>
                    </div>
                </div>
            </section>

            <div className="dashboard-grid">
                <div className="dashboard-card events-card">
                    <div className="card-header">
                        <div className="event-tabs">
                            <button 
                                className={`tab-btn ${eventTab === 'game' ? 'active' : ''}`}
                                onClick={()=> setEventTab('game')}
                            > Game Events 
                            </button>
                            <button 
                                className={`tab-btn ${eventTab === 'other' ? 'active' : ''}`}
                                onClick={()=> setEventTab('other')}
                            > Other Events
                            </button>
                        </div>
                        <MissionIcon/>
                        <span className="pulse-dot"></span>
                    </div>
                    <div className="events-list">
                        {filteredEvents.length === 0 && (
                            <div className="empty-events-msg">
                                <p> There are no active {eventTab} events at the moment.</p>
                                <small>Check back later captain!</small>
                            </div>
                        )}
                        {filteredEvents.map(event => (
                            <EventRow 
                                key={event.id}
                                event={event}
                                onClick={handleEventClick}
                            />
                        ))}
                    </div>
                </div>

                <div className="dashboard-card units-card">
                    <div className="card-header">
                        <h3>New Arrivals</h3>
                        <StarIcon />
                    </div>
                    <div className="units-grid">
                        {latestUnits.map(unit => (
                            <div key={unit.id} className="unit-icon-wrapper" title={unit.name}>
                                <img src={`${unit.image_url}.png`} alt={unit.name} loading="lazy"/>
                            </div>
                        ))}
                    </div>
                    </div>

                    <div className="dashboard-card changelog-card">
                        <div className="card-header">
                            <h3>Captain's Log</h3>
                            <LogIcon/>
                        </div>
                        <div className="changelog-list">
                            {changelog.map(log => (
                                <div 
                                    key={log.id}
                                    className={`log-item ${log.pinged ? 'pinned' : ''}`}
                                    onClick={()=> setActiveChangelog(log)}
                                >
                                    <div className="log-top">
                                        <span className="log-title">{log.title}</span>
                                        {log.pinged && ( <span className="pin-icon"><svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.4207 3.45395C13.5425 2.33208 15.3614 2.33208 16.4833 3.45395L20.546 7.51662C21.6679 8.63849 21.6679 10.4574 20.546 11.5793L17.1604 14.9648L19.8008 17.6052C20.1748 17.9792 20.1748 18.5855 19.8008 18.9594C19.4269 19.3334 18.8205 19.3334 18.4466 18.9594L16.0834 16.5962L15.674 18.8144C15.394 20.3314 13.5272 20.9118 12.4364 19.821L8.98476 16.3694L6.83948 18.5147C6.46552 18.8886 5.85922 18.8886 5.48526 18.5147C5.1113 18.1407 5.1113 17.5344 5.48525 17.1605L7.63054 15.0152L4.17891 11.5635C3.08815 10.4728 3.66858 8.60594 5.18551 8.32595L7.40369 7.91654L5.04048 5.55333C4.66652 5.17938 4.66652 4.57307 5.04048 4.19911C5.41444 3.82515 6.02075 3.82515 6.3947 4.19911L9.0351 6.83951L12.4207 3.45395ZM9.0351 9.54795L9.01673 9.56632L5.53313 10.2093L13.7906 18.4668L14.4336 14.9832L14.452 14.9648L9.0351 9.54795ZM15.8062 13.6106L10.3893 8.19373L13.7749 4.80818C14.1488 4.43422 14.7551 4.43422 15.1291 4.80818L19.1918 8.87084C19.5657 9.2448 19.5657 9.8511 19.1918 10.2251L15.8062 13.6106Z" fill="var(--text-accent)"/>
                                                </svg></span>)}
                                    </div>
                                    <span className="log-date">
                                        {new Date(log.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {activeChangelog && (
                    <div className="modal-overlay" onClick={()=> setActiveChangelog(null)}>
                        <div className="changelog-modal" onClick={e=> e.stopPropagation()}>
                            <h2>{activeChangelog.title}</h2>
                            <div className="changelog-body">
                                {activeChangelog.text}
                            </div>
                            <button className="close-modal-btn" onClick={()=> setActiveChangelog(null)}>Close</button>
                        </div>
                    </div>
                )}
                <TeamBuilderModal
                isOpen={isBuilderOpen}
                onClose={()=> setIsBuilderOpen(false)}
                 />

                <DataTransferModal 
                    isOpen={isTransferModalOepn}
                    onClose={()=> setIsTransferModalOpen(false)}
                />
            </div>

            
    );
}

export default HomeView;
