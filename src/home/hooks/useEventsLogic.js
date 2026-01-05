/**
 * HOOK: Events Business Logic
 * ---------------------------
 * Manages the filtering and navigation logic for the Events Widget.
 * 
 * LOGIC FLOW(Mermaid)
 * -------------------
 * ```
 * mermaid
 * graph TD
 *      A[Initial 'allEvents' Array] --> B{State: eventTab};
 *      B --> |'game'| C[Filter: e.mode !== 'other'];
 *      B --> |'other'| D[Filter: e.mode === 'other'];
 *      C --> E[Return filteredEvents];
 *      D --> E;
 * 
 *      F[User Clicks Event] --> G{handleEventClick};
 *      G --> H[Navigate to specific page];
 * ```
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const useEventsLogic = (allEvents = []) => {
    const navigate = useNavigate();
    const [eventTab, setEventTab] = useState('game');

    //Logic 1: Filtering
     const filteredEvents = useMemo(()=> {
        if(eventTab === 'game'){
            return allEvents.filter(e=> e.mode !== 'other');
        } else {
            return allEvents.filter(e=> e.mode === 'other');
        }
    }, [allEvents, eventTab]);

    //Logic 2: Navigator Handler
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

    return{
        eventTab,
        setEventTab,
        filteredEvents,
        handleEventClick 
    };
};