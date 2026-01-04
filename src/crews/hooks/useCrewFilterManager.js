import { useEffect, useCallback } from "react";
import viewConfig from "../utils/ViewConfig";
import { useCrewInitialization } from "./useCrewInitialization";

/**
 * PAGE CONTROLLER: Filter Logic
 * ------------------------------
 * Orchestrates the filtering logic, pagination and dependent dropdowns.
 * 
 * Key Logic:
 * - Dependent Dropdowns: If Filter A changes (e.g. "Challenge Type"),
 *   it automatically resets and repopulates Filter B (e.g. "Challenge Detail").
 * - Auto-Select: In modes like Kizuna/TM, it pre-selects the current active boss using eventNames.
 *
 */

export const useCrewFilterManager = (mode, config, pageSize, eventNames) => {
    //Initialize State & URL Handling
    const{
        crewFilters, setCrewFilters,
        currentPage, setCurrentPage,
        selectedBoss, setSelectedBoss,
        highlightedCrewId,
        isInitializingRef,
        clearUrlParams,
        searchParams,
        setSearchParams
    } = useCrewInitialization(mode, config, pageSize);

    /**
     * EFFECT 1: State -> URL Synchronization
     * Listen to `crewFilters` state changes and update the URL Query Params
     * 
     * @check isInitializingRef: Prevents overwriting the URL during the initial load (Deep Linking).
     */
    useEffect(()=> {
        //Avoid execution while initializating to avoid clearing ?crew=id
        if(isInitializingRef.current) return;

        const newParams = new URLSearchParams(searchParams);

        //Clean up old filer params related to this view
        config.dropdowns?.forEach(d=> newParams.delete(d.id));

        //Append current active filters.
        Object.entries(crewFilters).forEach(([key, value]) => {
            if(value){ newParams.set(key, value);}
    });

    //Sync selected Boss to URL for Coliseum mode
    //This ensures clicking a boss updates the URL to ?stage=BossName
    if(mode==='coliseum'){
        if(selectedBoss){
            newParams.set('stage', selectedBoss.name);
        } else{
            newParams.delete('stage');
        }
    }

    setSearchParams(newParams, {replace: true});
    //eslint-disable-next-line react-hooks/exhaustive-deps
}, [crewFilters, selectedBoss]);

    /**
     * EFFECT 2: Auto-Select Boss
     * Automatically selects the active boos for current events (Kizuna/TM/PKA)
     * if not other filter is active and we are not viewing a specific crew. 
     */
    useEffect(()=>{
        const disableAutoSelect = !!searchParams.get('crew');
        const hasBossFilter = crewFilters.boss || crewFilters.bosses;

        //Logic: If we have event names loaded AND no manual filter is set AND we aren't deep-linked to a crew
        if(Object.keys(eventNames).length > 0 && !hasBossFilter && !disableAutoSelect){
            if(mode === 'treasure_map'){
                setCrewFilters(prev=> ({...prev, boss: eventNames[290]}));
            } else if (mode === 'pirate_king_adventures'){
                setCrewFilters(prev=> ({...prev, bosses: eventNames[281]}));
            } else if (mode === 'kizuna_clash'){
                setCrewFilters(prev=> ({...prev, boss: eventNames[292]}));
            }
        }
    }, [mode, eventNames, crewFilters.boss, crewFilters.bosses, searchParams, setCrewFilters]);

    /**
     * HANDLER: Cascading Dropdowns Logic
     * Handles changes in filters and resets dependent filters (Parent -> Child).
     * e.g. If 'Challenge type' chages, reset 'Challenge Detail'
     */
    const handleFilterChange = useCallback((newFilter) => {
        clearUrlParams(); // Remove ?crew=ID when user manually filters
        const config = viewConfig[mode];

        setCrewFilters(prev =>{
            const updated = {...prev, ...newFilter};

            // Check if we need to reset a dependent dropdown.
            if(config?.dropdowns?.length > 1){
                const changedKey = Object.keys(newFilter)[0];
                const firstId = config.dropdowns[0].id;
                
                // If the Parent Dropdown changed...
                if(changedKey === firstId){
                    const secondFilter = config.dropdowns[1];
                    let secondOptions = [];
                    
                    //.. find valid options for the Child Dropdown
                    if(secondFilter.dependentOn){
                        const parentVal = updated[firstId];
                        secondOptions = parentVal? (secondFilter.optionsMap[parentVal] || []) : [];
                    } else {
                        secondOptions = secondFilter.options || [];
                    }
                    //.. and auto-select the first valid option of the child.
                    if(secondOptions.length > 0){
                        updated[secondFilter.id] = secondOptions[0];
                    }
                }
            }
        return updated;
        });
        setCurrentPage(1); //Always reset to page 1 on filter change 
    },[mode, clearUrlParams, setCrewFilters, setCurrentPage]);

    return{
        //State
        crewFilters,
        currentPage,
        selectedBoss,
        highlightedCrewId,
        isInitializingRef,

        //Actions
        setCrewFilters,
        setCurrentPage,
        setSelectedBoss,
        handleFilterChange,
        clearUrlParams,
        searchParams
    };
};