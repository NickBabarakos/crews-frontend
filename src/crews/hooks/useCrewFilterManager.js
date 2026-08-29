import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/client";
import viewConfig from "../utils/ViewConfig";

/**
 * Βοηθητική συνάρτηση: Υπολογισμός των σωστών αρχικών filters με βάση
 * το URL ή τα Defaults του Config.
 */
function resolveInitialFilters(mode, config, searchParams) {
    const filters = {};
    if (!config?.dropdowns || config.dropdowns.length === 0) return filters;

    // 1. Διάβασε από το URL
    config.dropdowns.forEach(d => {
        const urlVal = searchParams.get(d.id);
        const hasOptions = Array.isArray(d.options) && d.options.length > 0;
        const isValid = hasOptions ? d.options.includes(urlVal) : true;
        if (urlVal && isValid) {
            filters[d.id] = urlVal;
        }
    });

    // 2. Αν λείπουν φίλτρα, βάλε defaults
    if (mode === 'coliseum' && !filters.level) {
        filters.level = 'Clash!! (Hard)';
    }

    const firstDD = config.dropdowns[0];
    if (firstDD && !filters[firstDD.id] && firstDD.options?.length > 0) {
        filters[firstDD.id] = firstDD.options[0];
    }

    if (config.dropdowns.length > 1) {
        const secondDD = config.dropdowns[1];
        if (!filters[secondDD.id]) {
            if (secondDD.dependentOn === firstDD.id) {
                const parentVal = filters[firstDD.id];
                const depOptions = secondDD.optionsMap?.[parentVal] || [];
                if (depOptions.length > 0) filters[secondDD.id] = depOptions[0];
            } else if (secondDD.options?.length > 0) {
                filters[secondDD.id] = secondDD.options[0];
            }
        }
    }

    return filters;
}

export const useCrewFilterManager = (mode, dynamicConfig, pageSize, eventNames) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [crewFilters, setCrewFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [highlightedCrewId, setHighlightedCrewId] = useState(null);
    const [selectedBoss, setSelectedBoss] = useState(null);
    const [targetRank, setTargetRank] = useState(null);
    
    const isReadyRef = useRef(false);
    const isInitializingRef = useRef(true);

    // Refs για αποφυγή infinite loops στο initialization
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;

    const pageSizeRef = useRef(pageSize);
    pageSizeRef.current = pageSize;

    const isDynamicMode = ['pirate_king_adventures', 'treasure_map', 'kizuna_clash', 'blitz_battle'].includes(dynamicConfig?.mode);
    const hasLoadedEvents = Object.keys(eventNames || {}).length > 0;

    // --- 1. INITIALIZATION LIFECYCLE ---
    useEffect(() => {
        if (isDynamicMode && !hasLoadedEvents) {
            return;
        }

        const initialize = async () => {
            isInitializingRef.current = true;
            const currentParams = searchParamsRef.current;
            const currentPageSize = pageSizeRef.current;
            const crewId = currentParams.get('crew');
            let initialRank = null;

            // A. Deep Link Handling
            if (crewId) {
                setHighlightedCrewId(parseInt(crewId, 10));
                try {
                    const res = await apiClient.get(`/api/crews/${crewId}/context`);
                    const { mode: crewMode, rank } = res.data;
                    const targetRouteKey = Object.keys(viewConfig).find(k => viewConfig[k].mode === crewMode);

                    if (targetRouteKey && targetRouteKey !== mode) {
                        navigate(`/${targetRouteKey}?${currentParams.toString()}`, { replace: true });
                        return;
                    }
                    if (rank) {
                        initialRank = rank;
                        setTargetRank(rank);
                    }
                } catch (err) {
                    console.error("Context fetch error:", err);
                }
            } else {
                setHighlightedCrewId(null);
                setTargetRank(null);
            }

            // B. Υπολογισμός των σωστών Filters
            const resolvedFilters = resolveInitialFilters(mode, dynamicConfig, currentParams);
            setCrewFilters(resolvedFilters);

            // C. Coliseum Boss State
            const stageParam = currentParams.get('stage');
            if (mode === 'coliseum' && stageParam) {
                setSelectedBoss({ name: stageParam });
            } else if (!crewId) {
                setSelectedBoss(null);
            }

            // D. Initial Pagination
            if (initialRank && currentPageSize > 0) {
                setCurrentPage(Math.ceil(initialRank / currentPageSize));
            } else {
                setCurrentPage(1);
            }

            // E. Συγχρονισμός URL με τα αρχικά defaults
            setSearchParams(prev => {
                const nextParams = new URLSearchParams(prev);
                let needsUpdate = false;
                Object.entries(resolvedFilters).forEach(([k, v]) => {
                    if (v && nextParams.get(k) !== v) {
                        nextParams.set(k, v);
                        needsUpdate = true;
                    }
                });
                return needsUpdate ? nextParams : prev;
            }, { replace: true });

            isReadyRef.current = true;
            isInitializingRef.current = false;
        };

        initialize();
    }, [mode, dynamicConfig, hasLoadedEvents, isDynamicMode, navigate, setSearchParams]);

    // --- 2. RESIZE/PAGESIZE SYNC ΓΙΑ TARGET RANK ---
    useEffect(() => {
        if (targetRank && pageSize > 0) {
            setCurrentPage(Math.ceil(targetRank / pageSize));
        }
    }, [pageSize, targetRank]);

    // --- 3. STATE -> URL SYNC (Όταν αλλάζουν φίλτρα από τον χρήστη) ---
    useEffect(() => {
        if (!isReadyRef.current || isInitializingRef.current) return;

        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);

            // Καθαρισμός dropdown params
            dynamicConfig?.dropdowns?.forEach(d => newParams.delete(d.id));

            // Εγγραφή ενεργών φίλτρων
            Object.entries(crewFilters).forEach(([k, v]) => {
                if (v) newParams.set(k, v);
            });

            if (!highlightedCrewId) {
                newParams.delete('crew');
            }

            if (mode === 'coliseum') {
                if (selectedBoss?.name) newParams.set('stage', selectedBoss.name);
                else newParams.delete('stage');
            }

            // Αν δεν άλλαξε κάτι, επέστρεψε το ίδιο reference για αποφυγή re-renders
            if (newParams.toString() === prevParams.toString()) {
                return prevParams;
            }

            return newParams;
        }, { replace: true });
    }, [crewFilters, selectedBoss, highlightedCrewId, dynamicConfig, mode, setSearchParams]);

    // --- 4. FILTER CHANGE HANDLER ---
    const handleFilterChange = useCallback((newFilter) => {
        setHighlightedCrewId(null);
        setTargetRank(null);

        setCrewFilters(prev => {
            const updated = { ...prev, ...newFilter };
            const dropdowns = dynamicConfig?.dropdowns || [];

            if (dropdowns.length > 1) {
                const changedKey = Object.keys(newFilter)[0];
                const firstId = dropdowns[0].id;

                if (changedKey === firstId) {
                    const secondFilter = dropdowns[1];
                    let secondOptions = [];

                    if (secondFilter.dependentOn) {
                        const parentVal = updated[firstId];
                        secondOptions = parentVal ? (secondFilter.optionsMap?.[parentVal] || []) : [];
                    } else {
                        secondOptions = secondFilter.options || [];
                    }

                    if (secondOptions.length > 0) {
                        updated[secondFilter.id] = secondOptions[0];
                    }
                }
            }
            return updated;
        });

        setCurrentPage(1);
    }, [dynamicConfig]);

    // --- 5. CLEAR URL PARAMS ---
    const clearUrlParams = useCallback(() => {
        setSearchParams(prevParams => {
            if (!prevParams.has('crew')) return prevParams;
            const newParams = new URLSearchParams(prevParams);
            newParams.delete('crew');
            return newParams;
        }, { replace: true });
        setHighlightedCrewId(null);
        setTargetRank(null);
    }, [setSearchParams]);

    return {
        crewFilters,
        setCrewFilters,
        currentPage,
        setCurrentPage,
        selectedBoss,
        setSelectedBoss,
        highlightedCrewId,
        isInitializingRef,
        handleFilterChange,
        clearUrlParams,
        searchParams,
        setSearchParams
    };
};