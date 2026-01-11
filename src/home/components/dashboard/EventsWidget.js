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
import { MissionIcon, TimerIcon } from "../../../components/Icons";




const EventRow = ({event, onClick}) => {
    const {status, countdown, progress} = useEventTimer(event.start_time, event.end_time);
    if(status==='ended') return null;

    return(
        <div 
            className={`event-row ${status}`}
            onClick={()=> onClick(event.mode)}
            style={{cursor: event.mode && event.mode !== 'game_event' ? 'pointer' : 'default'}}
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