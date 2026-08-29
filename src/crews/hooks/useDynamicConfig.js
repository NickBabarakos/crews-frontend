import { useMemo } from "react";

/**
 * CONFIG HYDRATOR
 * ---------------
 * Takes the static ViewConfig and injects 'Live' data (Event Names) into it.
 * 
 * @param {object} staticConfig - The static config from ViewConfig. 
 * @param {object} eventNames  - Dictionary of { id: "Name" } fetched from API.
 */

export const useDynamicConfig = (staticConfig, eventNames) => {
    return useMemo(() => {
        if (!staticConfig) return null;
        
        // Deep copy για να μην πειράζουμε το static object
        const config = {
            ...staticConfig,
            dropdowns: (staticConfig.dropdowns || []).map(d => ({ ...d }))
        };

        const hasEventNames = eventNames && Object.keys(eventNames).length > 0;

        // 1. PKA
        if (config.mode === 'pirate_king_adventures' && hasEventNames) {
            const bossFilter = config.dropdowns.find(d => d.id === 'bosses');
            if (bossFilter) {
                const dynamicOptions = [eventNames[281], eventNames[284], eventNames[287]].filter(Boolean);
                if (dynamicOptions.length > 0) bossFilter.options = dynamicOptions;
            }
        }

        // 2. TM
        if (config.mode === 'treasure_map' && hasEventNames) {
            const tmFilter = config.dropdowns.find(d => d.id === 'boss');
            if (tmFilter) {
                const dynamicOptions = [eventNames[290], eventNames[291]].filter(Boolean);
                if (dynamicOptions.length > 0) tmFilter.options = dynamicOptions;
            }
        }

        // 3. Kizuna
        if (config.mode === 'kizuna_clash' && hasEventNames) {
            const kizunaFilter = config.dropdowns.find(d => d.id === 'boss');
            if (kizunaFilter) {
                const options = [eventNames[292], eventNames[293]].filter(Boolean);
                if (eventNames[294] && eventNames[294].toLowerCase() !== 'no') {
                    options.push(eventNames[294], eventNames[295]);
                }
                kizunaFilter.options = options.filter(Boolean);
            }
        }
    
        if (config.mode === 'blitz_battle' && hasEventNames) {
            const blitzFilter = config.dropdowns.find(d => d.id === 'boss');
            if (blitzFilter && eventNames[296]) {
                blitzFilter.options = [eventNames[296]].filter(Boolean);
            }
        }

        return config;
    }, [staticConfig, eventNames]);
};