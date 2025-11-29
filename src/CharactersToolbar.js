import './Toolbar.css';
import Dropdown from './Dropdown';
import { useState, useRef } from 'react';
import { useCollection } from './CollectionContext';

const LEGEND_OPTIONS = [
    'All Legends', 'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
    'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

const RR_OPTIONS = [
    'All Rare Recruits', 'Treasure Map Rare Recruits', 'Treasure Map Limited Characters', 'Kizuna Clash Limited Characters',
    'Rumble Rare Recruits', 'Support Characters', 'Other Rare Recruits'
];

function CharactersToolbar({totalCount, characterCategory, onCategoryChange, subCategory, onSubCategoryChange, isPlus, onIsPlusChange, searchTerm, onSearchChange}){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {getOwnedCountByCategory} = useCollection();
    const ownedCount = getOwnedCountByCategory(characterCategory, subCategory, isPlus);
    const currentOptions = characterCategory === 'legends' ? LEGEND_OPTIONS : RR_OPTIONS;

     const handleSubCategorySelect = (selection) => {
        onSubCategoryChange(selection);
        setIsDropdownOpen(false);
    };

    return(
        <>
            <div className="toolbar-left">
                {totalCount > 0 && (
                    <div className="results-counter">
                        Owned: <span style={{color: '#4ade80'}}>{ownedCount}</span>/{totalCount}
                    </div>
                )}
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth="2" strokeLinecap = "round" strokeLinejoin ="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="16.65" y2="16.64"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Name or Id..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e)=> onSearchChange(e.target.value)}
                        />
                </div>
            </div>

            <div className="toolbar-spacer"></div>

            <div className="toolbar-right">
                <div className="filter-group">
                    <label>Category:</label>
                    <div className="character-category-buttons">
                        <button 
                            className={`header-button ${characterCategory === 'legends' ? 'active' : ''}`}
                            onClick={()=> onCategoryChange('legends')}
                        > Legends 
                        </button>
                        <button 
                            className={`header-button ${characterCategory === 'rareRecruits' ? 'active': ''}`}
                            onClick={()=> onCategoryChange('rareRecruits')}
                        > Rare Recruits
                        </button> 
                    </div>
            </div>

            {
                <div className="filter-group">
                    <div className="character-category-buttons">
                        <button 
                            className={`header-button ${isPlus ? 'active' : ''}`}
                            onClick={()=> onIsPlusChange(!isPlus)}
                        >
                            {characterCategory === 'legends' ?  '6+ Legends': '5+ Rare Recruits'}
                        </button>
                    </div>
                </div>
            }

            {!isPlus && (
                <div className="filter-group" ref={dropdownRef}>
                    <label>Sub-Category:</label>
                    <Dropdown
                        options={currentOptions}
                        selectedOption={subCategory}
                        onSelect={handleSubCategorySelect}
                        isOpen={isDropdownOpen}
                        onToggle={()=> setIsDropdownOpen(!isDropdownOpen)}
                    />
                </div>
            )}
            </div>
        </>

    )
}

export default CharactersToolbar;