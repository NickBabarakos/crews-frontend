import { useEffect, useMemo } from "react";
import { useBosses } from "../../hooks/useBosses";
import { useCrews } from "../../hooks/useCrews";
import { useCrewsSorting } from "./useCrewsSorting";
import { useCollection } from "../../context/CollectionContext";

/**
 * DATA AGGREGATOR
 * ---------------------
 * Collects and prepeares all necessary daya for he CrewPage UI.
 * 
 * Combines:
 * 1. Bosses Data (Specifically for Coliseum mode grid view).
 * 2. Crews Data (The main list)
 * 3. Sorting Logic (Applies "Smart Sorting" based on owned units).
 * 
 * Returns a simplified object that the View component can consume directly.
 */

export const useCrewsPageData = ({
    mode,
    config,
    crewFilters,
    selectedBoss,
    currentPage,
    pageSize,
    showOnlyOwned,
    sortBy,
    isInitializingRef
}) => {
    const {ownedItems} = useCollection();

    // Derive list of owned Character IDs from filtering/sorting 
    const ownedIds = useMemo(()=>{
        return Object.keys(ownedItems).map(Number).filter(id => id !== -1);
    }, [ownedItems]);
    
    // --- 1. Bosses Data Logic (Specific to Coliseum) ----
    // Only fetch bosses if we are in Coliseum mode AND haven't selected on yet 
    const shouldFetchBosses = mode === 'coliseum' && !selectedBoss;

    const { data: bossesData, isLoading: isBossLoading} = useBosses({
        mode: 'coliseum',
        level: crewFilters.level, 
        page: currentPage, 
        limit: 60,
        enabled: shouldFetchBosses
    });


    //--- 2. Crews Data Logic (Main List) ---
    // Prepare filters for API: Add stage name if in Coliseum mode
    const activeFilters = {...crewFilters};
    if(mode === 'coliseum' && selectedBoss) {activeFilters.stage = selectedBoss.name;}


    //Validation: Are all required dropdowns selected?
    const hasFilters = config.dropdowns ? config.dropdowns.every(d=> crewFilters[d.id]) : true;

    //Trigger Condition: 
    // 1. Non-Coliseum: Fetch if filters are ready OR if we are initializing (to show placeholders during URL sync).
    // 2. Coliseum: Fetch only if a boss is selected. We explicitly exclude 'isInitializingRef' here to prevent
    //    placeholders from appearing below the BossGridView while the page loads.
    const shouldFetchCrews = (mode !== 'coliseum' && (hasFilters || isInitializingRef.current)) || 
                             (mode === 'coliseum' && selectedBoss);

    const {data: crewData} = useCrews({
        mode: config?.mode,
        filters: activeFilters,
        page: currentPage,
        limit: pageSize,
        showOnlyOwned: showOnlyOwned,
        ownedIds: ownedIds,
        enabled: !!shouldFetchCrews 
    }); 

    // Effect: Unlock URL syncing once we first batch of data arrives
    useEffect(()=> {
        if(crewData && isInitializingRef.current){
            isInitializingRef.current = false;
        }
    }, [crewData, isInitializingRef]);


    //--- 3. Sorting Logic ---
    const rawCrews = crewData?.crews || [];
    const sortedCrews = useCrewsSorting(rawCrews, sortBy);

    return{
        bossesData,
        isBossLoading,
        crewData,          // Χρήσιμο για το Pagination (hasMore)
        sortedCrews,       // Τα τελικα δεδομένα προς εμφάνιση
        shouldFetchCrews   // Επιστρέφουμε το flag αν χρειαστεί για UI checks (π.χ. showActions)
    }
}