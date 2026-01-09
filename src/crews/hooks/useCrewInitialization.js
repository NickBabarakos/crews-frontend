import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/client";
import viewConfig from "../utils/ViewConfig";

/**
 * INITIALIZATION & URL SYNC HOOK
 * ------------------------------
 * Manages the bidirectional releationship between URL Query Params and App State.
 * 
 * Responsibilities: 
 * 1. Deep Linking: If user enters "/grandVoyage?stage=Arlong", it sets the filters automatically.
 * 2. Redirects: If user clicks a shared link for a crew in a different mode, it redirects to the correct page.
 * 3. URL Updates: Updates the browser URL when filters change (without reloading).
 * 
 * 
 * */

export const useCrewInitialization = (mode, config, pageSize) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const crewIdParam = searchParams.get('crew');

    const [crewFilters, setCrewFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [highlightedCrewId, setHighlightedCrewId] = useState(null);
    const [selectedBoss, setSelectedBoss] = useState(null);

    // Ref to block 'useEffect' from overwriting URL while we are reading from it.
    const crewRankRef = useRef(null);
    const isInitializingRef = useRef(false);

    /**
     * EFFECT 1: Cleanup Highlight
     * If the user manually removes '?crew=' from URL, clear the highlight state.
     */
    useEffect(()=> {
        if(!searchParams.get('crew') && highlightedCrewId){
            setHighlightedCrewId(null);
        }
    }, [searchParams, highlightedCrewId]);


    /**
     * EFFECT 2(CORE EFFECT): Initialization Sequence
     * Runs on mount or mode change to setup the view based on URL.
     */
    useEffect(()=> {
        const crewId = searchParams.get('crew');

        const initialize = async()=> {
            // LOCK: Start Initialization
            isInitializingRef.current = true;

            let filters = {};
            let initalPage = 1;

            // PART A: Handle Shared Link (Dep Link to a specific Crew)
            if(crewId){
                setHighlightedCrewId(parseInt(crewId));
                try{
                    // Fetch context to see if this crew belongs to the current mode
                    const res = await apiClient.get(`/api/crews/${crewId}/context`);
                    const {mode: crewMode, rank} = res.data;
                    const targetRouteKey = Object.keys(viewConfig).find(key=> viewConfig[key].mode === crewMode);

                    if(rank) crewRankRef.current = rank;

                    // Redirect if crew belongs to a different game mode
                    if(targetRouteKey && targetRouteKey !== mode){
                        navigate(`/${targetRouteKey}?${searchParams.toString()}`, {replace: true});
                        return;
                    }
                    

                }catch(err) { console.error("Error loading context", err);}
            } else {
                crewRankRef.current = null;
            }

            
            //PART B: Read Filters from URL (works for deep links and normal naviation)
            if(config.dropdowns){
                config.dropdowns.forEach(d=> {
                    const val = searchParams.get(d.id);
                    const hasOptions = d.options && Array.isArray(d.options);
                    const optionsLoaded = hasOptions ? d.options.length > 0 : false;
                    const isValidOption = hasOptions ? d.options.includes(val) : true;
                    if(val && (!optionsLoaded || isValidOption)) filters[d.id] = val;
                });
            }

            //PART C: Apply Defaults (Only if URL has no filters)
            if(Object.keys(filters).length === 0){
                if(mode === 'coliseum'){
                    filters.level = 'Clash!! (Hard)';
                } else if (config.dropdowns.length > 0){
                    //Default to first option of the first dropdown 
                    const firstDD = config.dropdowns[0];
                    if(firstDD.options?.length >0){
                        filters[firstDD.id] = firstDD.options[0];
                    }
                    // Handle dependent defaults
                    if(config.dropdowns.length > 1){
                        const secondDD = config.dropdowns[1];
                        if(secondDD.dependentOn === firstDD.id){
                            const dependentOptions = secondDD.optionsMap?.[firstDD.options[0]] || [];
                            if(dependentOptions.length >0) filters[secondDD.id] = dependentOptions[0];
                        } else if (secondDD.options?.length > 0){
                            filters[secondDD.id] = secondDD.options[0];
                        }
                    }
                }
            }
        //Apply calculated filters to state   
        setCrewFilters(filters);
        setCurrentPage(initalPage);
        
        //Restore selectedBoss only if 'stage' parameter actually exists in URL
        const stageParam = searchParams.get('stage');

        if(mode === 'coliseum' && stageParam){ setSelectedBoss({name: stageParam});}
        else if(!crewId) {setSelectedBoss(null);} //Only reset if NOT deep linking to a specific crew
        
        // Sync URL with Defaults if they differ
        const currentParams = new URLSearchParams(searchParams);
        let needsUpdate = false;
        Object.entries(filters).forEach(([key,value]) => {
            if(currentParams.get(key) !== value){
                currentParams.set(key, value);
                needsUpdate = true;
            }
        }); 

        if(needsUpdate){
            setSearchParams(currentParams, {replace: true});
        }

        // UNLOCK: Initialization complete (allow normal URL syncing)
        setTimeout(()=> {isInitializingRef.current = false;}, 100);
        };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, crewIdParam, config, navigate]);

    useEffect(()=> {
        if(pageSize > 0 && crewRankRef.current){
            setCurrentPage(Math.ceil(crewRankRef.current/pageSize));
        }
    }, [pageSize])

    // Helper to remove crew ID from URL (e.g when closing a modal or changing filter)
    const clearUrlParams = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);

        if(newParams.has('crew')){
            newParams.delete('crew');
            setSearchParams(newParams);
            setHighlightedCrewId(null);
        }
    }, [searchParams, setSearchParams]);

    return{
        crewFilters, setCrewFilters,
        currentPage, setCurrentPage,
        highlightedCrewId,
        setHighlightedCrewId,
        selectedBoss, setSelectedBoss,
        isInitializingRef,
        clearUrlParams,
        searchParams,
        setSearchParams
    };


};