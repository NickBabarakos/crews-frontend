import './Toolbar.css';
import Dropdown from './Dropdown';
import { useState, useRef } from 'react';
import { useCollection } from './CollectionContext';
import FilterModal from './FilterModal';

const LEGEND_OPTIONS = [
    'All Legends', 'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
    'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

const RR_OPTIONS = [
    'All Rare Recruits', 'Treasure Map Rare Recruits', 'Treasure Map Limited Characters', 'Kizuna Clash Limited Characters',
    'Rumble Rare Recruits', 'Support Characters', 'Other Rare Recruits'
];

function CharactersToolbar({totalCount, characterCategory, onCategoryChange, subCategory, onSubCategoryChange, isPlus, onIsPlusChange, searchTerm, onSearchChange, onAdminTrigger}){
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {getOwnedCountByCategory} = useCollection();
    const ownedCount = getOwnedCountByCategory(characterCategory, subCategory, isPlus);
    const currentOptions = characterCategory === 'rareRecruits' ? RR_OPTIONS: LEGEND_OPTIONS;
    const isDropdownDisabled = characterCategory === 'all' || isPlus;

     const handleKeyDown = (e) => {
        if(e.key === 'Enter' && searchTerm.toLowerCase().trim() === 'admin'){
            onAdminTrigger();
        }
     };

     const handleSubCategorySelect = (selection) => {
        onSubCategoryChange(selection);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
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
                <svg className="search-icon" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="16.65" y2="16.64"></line>
                </svg>
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
           </div>
            <div className="mobile-filter-wrapper show-on-mobile-only">
            <button className="mobile-filter-btn" onClick={()=> setIsFilterModalOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="16" y2="16"></line>
                </svg>
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
                        selectedOption = {subCategory}
                        onSelect = {handleSubCategorySelect}
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
                    selectedOption={subCategory}
                    onSelect={handleSubCategorySelect}
                    isOpen={isMobileDropdownOpen}
                    onToggle={()=> setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                />
            </div>
            <hr style={{width: '100%', borderColor:'rgba(255, 255, 255, 0.1)'}}/>
            {renderFilters(true)}
            </FilterModal>
        </>
    )
}

export default CharactersToolbar;