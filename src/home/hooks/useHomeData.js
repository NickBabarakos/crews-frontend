/**
 * HOOK: Home Data Aggregator
 * --------------------------
 * Fetches all data for the dashboard in paralled to optimize load time.
 * 
 * FETCH STRATEGY:
 * Uses `Promise.all` to start all 4 request simultaneously.
 * If ANY request fails, it triggers the catch block (Fail-Fast behavior).
 * 
 * APIs Called:
 * 1. getHomeStats -> Global Counters
 * 2. getActiveEvents -> Timers & Progress Bar
 * 3. getLatestUnits -> New Arrivals Widger
 * 4. getChangelog -> Admin Logs
 */
import { useState, useEffect } from "react";
import { getHomeStats, getActiveEvents, getLatestUnits, getChangelog } from "../../api/homeService";

export const useHomeData = () => {
    const [stats, setStats] = useState({ totalCrews: 0});
    const [events, setEvents] = useState([]);
    const [latestUnits, setLatestUnits] = useState([]);
    const [changelog, setChangelog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        let isMounted = true;

        const fetchData = async () => {
            try{
                const [statsRes, eventsRes, unitsRes, logRes] = await Promise.all([
                    getHomeStats(),
                    getActiveEvents(),
                    getLatestUnits(),
                    getChangelog()
                ]);
                if(isMounted){
                    setStats(statsRes);
                    setEvents(eventsRes);
                    setLatestUnits(unitsRes);
                    setChangelog(logRes);
                }
            } catch (error){
                console.error("Failed to load home data", error);
                if(isMounted) setError(error);
            } finally{
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();

        return () => {isMounted = false;};
    }, []);
    return { stats, events, latestUnits, changelog, isLoading, error};

};