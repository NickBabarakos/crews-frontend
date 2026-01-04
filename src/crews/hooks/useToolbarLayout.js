import { useMemo } from "react";

/**
 * LAYOUT STRATEGY HOOK
 * --------------------
 * Analyzes the ViewConfig  to determine the best UI layout for filters.
 * 
 * Logic:
 * - Counts how many "Dropdowns" vs "Pills" (options <=7) exist.
 * - Decides if Mobile view should collapse all filters into a modal or show pills.
 * 
 * Returns:
 * @returns {object} { mobileLayoutStrategy, isPillsOnly}
 */

export const useToolbarLayout = (dynamicConfig) => {
    return useMemo(()=> {
        let dropdownCount = 0;
        let pillCount = 0;
        if (!dynamicConfig?.dropdowns) return {mobileLayoutStrategy: 'collapse-all', isPillsOnly: false};

        // 1. Analyze complexity of filters
        dynamicConfig.dropdowns.forEach(filter => {
            const isPill = filter.options?.length <= 7 && !filter.dependentOn;
            if(isPill) pillCount++;
            else dropdownCount++;});
    
            const _isPillsOnly = dropdownCount === 0 && pillCount > 0;
            
            //2. Determine Strategy
            // If we stricly have 4 pills and 0 dropdowns (e.g. simple modes), keep pills on mobile.
            // Otherwise, collapse everything to a "Filter" button on mobile to save space.
            if (dropdownCount === 0 && pillCount === 4) return {mobileLayoutStrategy: 'keep-pills', isPillsOnly: _isPillsOnly};
    
            return {mobileLayoutStrategy: 'collapse-all', isPillsOnly: _isPillsOnly};
        }, [dynamicConfig]);

};