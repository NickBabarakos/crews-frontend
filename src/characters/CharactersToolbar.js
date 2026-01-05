import React, {useRef} from 'react';
import '../components/Toolbar.css';
import Dropdown from '../components/common/Dropdown';
import FilterModal from '../crews/components/modals/FilterModal';
import ViewBoxControl from './ViewBoxControl';
import { MobileFilterIcon, SearchIcon } from '../components/Icons';



function CharactersToolbar({
    //Data Props for Page/Hooks
    totalCount,
    ownedCount,
    characterCategory,
    subCategory,
    isPlus,
    searchTerm,

    //Handlers
    onCategoryChange,
    onSubCategoryChange,
    onIsPlusChange,
    onSearchChange,
    onAdminTrigger,

    //Logic Props (from useCharacterToolbarLogic)
    logic
}){
    const dropdownRef = useRef(null);
    const{
        isDesktopDropdownOpen, setIsDesktopDropdownOpen,
        isMobileDropdownOpen, setIsMobileDropdownOpen,
        isFilterModalOpen, setIsFilterModalOpen,
        currentOptions,
        isDropdownDisabled,
        handleSubCategorySelect
    } = logic; 
    
    //--- Default τιμη για το Dropdown---
    // Αν το subCategory ειναι κενό, παίρνουμε την πρώτη επιλογή (π.χ. "All Legends")
    const activeSubCategory = subCategory || currentOptions[0];

     const handleKeyDown = (e) => {
        if(e.key === 'Enter' && searchTerm.toLowerCase().trim() === 'admin'){
            onAdminTrigger();
        }
     };

     

    const handleMainCategoryClick = (category) => {
        if(characterCategory !== category){
            onCategoryChange(category);
        }
    };

    const renderFilters = (isMobile = false) => (
        <div className={isMobile ? "filter-modal-body-content" : "toolbar-right desktop-only"}>
            <button 
                className={`pill-button ${characterCategory === 'all' ? 'active' : ''}`}
                onClick={()=> handleMainCategoryClick('all')}> All Characters</button>
            
            <div className="button-group">
                <button
                    className={`group-main-btn ${characterCategory === 'legends' ? 'active' : ''}`}
                    onClick={()=> handleMainCategoryClick('legends')}>Legends</button>
                <button 
                    className={`group-toggle-btn ${characterCategory === 'legends' && isPlus ? 'active' : ''}`}
                    onClick={()=> characterCategory === 'legends' && onIsPlusChange(!isPlus)}
                    disabled={characterCategory !== 'legends'}>6+</button>
            </div>

            <div className="button-group">
                <button 
                    className={`group-main-btn ${characterCategory === 'rareRecruits' ? 'active' : ''}`}
                    onClick={()=> handleMainCategoryClick('rareRecruits')}>Rare Recruits</button>
                <button 
                    className={`group-toggle-btn ${characterCategory === 'rareRecruits' && isPlus ? 'active': ''}`}
                    onClick={()=> characterCategory === 'rareRecruits' && onIsPlusChange(!isPlus)}
                    disabled={characterCategory !== 'rareRecruits'}>5+</button>
            </div>
        </div>
    );

    return(
        <>
           <div className="toolbar-left">
            <div className="search-input-wrapper">
                    <SearchIcon/>
                <input 
                    type="text"
                    placeholder="Search Name or Id..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e)=> onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {totalCount > 0 && (
                <div className="results-counter">
                    Owned: <span style={{color: '#4ade80'}}>{ownedCount}</span>/{totalCount}
                </div>
            )}

            <ViewBoxControl/>
           </div>

            <div className="mobile-filter-wrapper show-on-mobile-only">
            <button className="mobile-filter-btn" onClick={()=> setIsFilterModalOpen(true)}>
                <MobileFilterIcon/>
                Filters
            </button>
            </div>

           <div className="toolbar-center desktop-only">
                <div 
                    className="filter-group"
                    ref={dropdownRef}
                    style={{opacity: isDropdownDisabled ? 0.5:1, pointerEvents: isDropdownDisabled ? 'none' : 'auto'}}
                >
                    <Dropdown
                        options={currentOptions}
                        selectedOption = {activeSubCategory}
                        onSelect =  {(val) => handleSubCategorySelect(onSubCategoryChange, val)}
                        isOpen={isDesktopDropdownOpen}
                        onToggle={()=> setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                    />
                </div>
           </div>

           {renderFilters(false)}

           <FilterModal
                isOpen={isFilterModalOpen}
                onClose={()=> setIsFilterModalOpen(false)}
                title="Character Filters"
            >

            <div style={{opacity: isDropdownDisabled ? 0.5:1, pointerEvents: isDropdownDisabled ? 'none' : 'auto' }}>
                <label style={{display:'block', marginBottom: '8px', color: '#aaa', fontSize:'12px'}}>Sub-Category</label>
                <Dropdown
                    options={currentOptions}
                    selectedOption={activeSubCategory}
                    onSelect={(val) => handleSubCategorySelect(onSubCategoryChange, val)}
                    isOpen={isMobileDropdownOpen}
                    onToggle={()=> setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                />
            </div>
            <hr style={{width: '100%', borderColor:'var(--border-light)'}}/>
            {renderFilters(true)}
            </FilterModal>
        </>
    )
}

export default CharactersToolbar;