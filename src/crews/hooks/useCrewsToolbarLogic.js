import { useState, useMemo } from "react";
import { useToolbarLayout } from "./useToolbarLayout";
import { usePillScroll } from "../../hooks/usePillScroll";

/**
 * TOOLBAR PRESENTER HOOK
 * Acts as the logic layer strictly for the CrewsToolbar UI Component
 * 
 * Responsibilities:
 * 1. UI State Mamangment: Handles which dropdown is currently open (Accordion logic)
 * 2. Prop Calculation: Prepares the exact props needed for each <FilterControl /> based on dependencies.
 * 3. Layout Integration: Combines dynamic config and scroll logic to prepare the render list.
 */

export const useCrewsToolbarLogic = ({
    config,
    eventNames,
    crewFilterValues,
    onCrewFiltersChange,
    disabled
}) => {
    // --- Local UI State ---
    const [openToolbarDropdown, setOpenToolbarDropdown] = useState(null);
    const [openModalDropdown, setOpenModalDropdown] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    //--- Sub-Hooks Integration ---
    const dynamicConfig = config;
    const {mobileLayoutStrategy, isPillsOnly} = useToolbarLayout(dynamicConfig);
    //2. UI/Scroll Logic Hook (Handles horizontal scrolling for pills)
    const {scrollStates, pillsRefs, checkScroll, handleWheel} = usePillScroll(dynamicConfig, crewFilterValues, isPillsOnly);

    //--Core Logic: Prepare Renderable Filters---
    const renderableFilters = useMemo(() => {
        if (!dynamicConfig.dropdowns) return [];

        return dynamicConfig.dropdowns.map((filterConfig, index) =>{
        
            let options = filterConfig.options;
            const isDependent = index > 0 && !!filterConfig.dependentOn;
        
        if (isDependent){
            const parentFilterId = filterConfig.dependentOn;
            const parentValue = crewFilterValues[parentFilterId];
            // Logic: Only show options relevant to the parent's selection
            options = parentValue ? filterConfig.optionsMap[parentValue] || [] : [];
    }

    const isPill = options?.length <= 7;
    const isFirstDropdown = index === 0 && (options?.length > 7 || !!filterConfig.dependentOn);

    return{
        id: filterConfig.id,
        type: isPill ? 'pill' : 'dropdown',
        options: options,
        value: crewFilterValues[filterConfig.id],
        placeholder: filterConfig.placeholder,
        onSelect: onCrewFiltersChange,
        disabled: disabled,
        mode: dynamicConfig.mode,

        // Scroll Logic (Pills)
        scrollMode: scrollStates[filterConfig.id] || 'start',
        onScroll: (e) => checkScroll(e.target, filterConfig.id),
        onWheel: handleWheel,
        pillRef: (el) => (pillsRefs.current[filterConfig.id] = el),
        
        //Interaction Logic (Dropdowns)
        isOpen: openToolbarDropdown === filterConfig.id,
        onToggle: ()=> setOpenToolbarDropdown(prev => prev === filterConfig.id ? null: filterConfig.id),

        //Layout Helpers
        isFirstDropdown: isFirstDropdown
    };
});
}, [dynamicConfig, crewFilterValues, onCrewFiltersChange, disabled, scrollStates, openToolbarDropdown, checkScroll, handleWheel, pillsRefs]);

    //---Layout Split---
    const firstFilter = renderableFilters[0];
    const isFirstBig = firstFilter?.isFirstDropdown;
    const scrollableFilters = isFirstBig ? renderableFilters.slice(1) : renderableFilters;

    return{
        //Render Data
        firstFilter,
        isFirstBig,
        scrollableFilters,
        allFilters: renderableFilters,

        //UI State
        mobileLayoutStrategy,
        isFilterModalOpen,


        //Handlers
        openFilterModal: ()=> setIsFilterModalOpen(true),
        closeFilterModal: ()=> setIsFilterModalOpen(false),

        //Helper: Modifies props specifically for the Mobile Modal view
        getModalFilterProps: (filter) => ({
            ...filter,
            isOpen: openModalDropdown === filter.id,
            onToggle: ()=> setOpenModalDropdown(prev => prev === filter.id ? null: filter.id),
            isMobileModal: true 
        })
    };
    
};