import { useState, useEffect } from "react";
import { getEventNames } from "../../api/stageService";

/**
 * EVENT DICTIONARY HOOK
 * --------------------
 * Fetches the mapping of Stage IDs -> Event Names (e.g. 290 -> "Vs Big Mom").
 * Used to hydrate the ViewConfig and Dynamic Dropdowns.
 */

export const useEventNames = () =>{
    const [eventNames, setEventNames] = useState({});

    useEffect(()=> {
        const fetchEventNames = async()=> {
            try{
                const data = await getEventNames();
                setEventNames(data);
            } catch(err){
                console.error("Error fetching event names", err);
            }
        };
        fetchEventNames();
    }, []);

    return eventNames;

};