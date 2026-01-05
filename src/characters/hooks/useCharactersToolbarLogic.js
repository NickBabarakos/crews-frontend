import {useState} from 'react';
import { RR_OPTIONS, LEGEND_OPTIONS } from '../../utils/constants';

export const useCharactersToolbarLogic = (characterCategory, isPlus) => {
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    
    //Επιλογη σωστων Options βασει κατηγοριας
    const currentOptions = characterCategory === 'rareRecruits' ? RR_OPTIONS: LEGEND_OPTIONS;

    //Το dropdown ειναι ανενεργο στο 'All' ή αν βλέπουμε '+' characters
    const isDropdownDisabled = characterCategory === 'all' || isPlus;

    const handleSubCategorySelect = (onSubCategoryChange, selection) => {
        onSubCategoryChange(selection);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    return{
        //State
        isDesktopDropdownOpen, setIsDesktopDropdownOpen,
        isMobileDropdownOpen, setIsMobileDropdownOpen,
        isFilterModalOpen, setIsFilterModalOpen,

        //Data
        currentOptions,
        isDropdownDisabled,

        //Handlers
        handleSubCategorySelect
    };
};