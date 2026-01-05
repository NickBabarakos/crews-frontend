/**
 * COMPONENT: Events Dashboard Widget
 * ---------------------------------
 * Displays a list of active and upcoming events with timers.
 * It uses the `useEventLogic` hook to manage state and interactions.
 * 
 * UI STATE FLOW (Mermaid):
 * --------------------------
 * 
 * ```mermaid
 * stateDiagram-v2
 *      [*] --> GameEvents
 *      
 *      GameEvents: Showing Game Events
 *      OtherEvents: Showing Other Events
 * 
 *      GameEvents --> OtherEvents: User clicks 'Other' Tab
 *      OtherEvents --> GameEvents: User clicks 'Game' Tab
 * ```
 */

import React from "react";
import DashboardCard from "./DashboardCard";
import { useEventsLogic } from "../../hooks/useEventsLogic";
import { useEventTimer } from "../../../hooks/useEventTimer";

const MissionIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 2a1 1 0 0 0-1 1v1.001c-.961.014-1.34.129-1.721.333a2.272 2.272 0 0 0-.945.945C3.116 5.686 3 6.09 3 7.205v10.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h11.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926V7.205c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C19.34 4.13 18.961 4.015 18 4V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1zM5 9v8.795c0 .427.019.694.049.849.012.06.017.074.049.134a.275.275 0 0 0 .124.125c.06.031.073.036.134.048.155.03.422.049.849.049h11.59c.427 0 .694-.019.849-.049a.353.353 0 0 0 .134-.049.275.275 0 0 0 .125-.124.353.353 0 0 0 .048-.134c.03-.155.049-.422.049-.849L19.004 9H5zm8.75 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5z" fill="currentColor"></path>
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

const EventsWidget = ({events = []}) => {
    //Κάλεσε το hook για τη λογικη
    const {eventTab, setEventTab, filteredEvents, handleEventClick} = useEventsLogic(events);

    // Header Action (Tabs)
    const renderTabs =(
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
    );

    return(
        <DashboardCard 
            title="Events"
            icon={<MissionIcon/>}
            headerAction={renderTabs}
            scrollable={true}
        >
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

        </DashboardCard>
    );
};

export default EventsWidget;