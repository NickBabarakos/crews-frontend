import './App.css';
import { useState, useRef, useEffect } from 'react';
import Dropdown from './Dropdown';

const legendOptions = [
    'All Legends', 'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only',
    'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

const TOTAL_PLACEHODLERS = 48;

function CharacterCard({character}){
    return(
        <a href={character.info_url} target="_blank" rel="noopener noreferrer" className="character-card">
            <img src={`${character.image_url}.png`} alt={character.name} />
        </a>
    );
}



function CharactersView({ characters, totalCount, characterCategory, legendSubCategory, onLegendSubCategoryChange }){
    const hasData = characters && characters.length>0;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(()=> {

        if (!isDropdownOpen) return;
        const scrollContainer = dropdownRef.current?.closest('.main-content');
        if (!scrollContainer) return;

        function handleClickOutside(event) {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        
        const computedStyle = window.getComputedStyle(scrollContainer);
        const originalPaddingRightValue = parseFloat(computedStyle.paddingRight);
        const scrollbarWidth = scrollContainer.offsetWidth - scrollContainer.clientWidth;
        const originalInlineOverflow = scrollContainer.style.overflow;
        const originalInlinePaddingRight = scrollContainer.style.paddingRight;

        document.addEventListener('mousedown', handleClickOutside);

        scrollContainer.style.paddingRight = `${originalPaddingRightValue + scrollbarWidth}px`;
        scrollContainer.style.overflow = 'hidden';

        return ()=> {
            scrollContainer.style.paddingRight = originalInlinePaddingRight;
            scrollContainer.style.overflow = originalInlineOverflow;
        };
    }, [isDropdownOpen]);

    const handleSubCategorySelect = (selection) => {
        const valueToUpdate = selection === 'All Legends' ? 'all' : selection;
        onLegendSubCategoryChange(valueToUpdate);
        setIsDropdownOpen(false);
    }; 

    const getSelectedOptionLabel = () => {
        if (legendSubCategory === 'all') {
            return 'All Legends';
        }
        return legendSubCategory;
    };

    return (
        <div className="character-display-wrapper">
            {hasData && (
                <div className="results-counter">
                    {totalCount} / {totalCount}
                </div>
            )}
        <div className ="content-container">
            {characterCategory === 'legends' && ( 
                <div className = "sub-category-filter" ref={dropdownRef}>
                    <Dropdown
                        className="legends-dropdown" 
                        options={legendOptions}
                        selectedOption = {getSelectedOptionLabel()}
                        onSelect = {handleSubCategorySelect}
                        isOpen = {isDropdownOpen}
                        onToggle={()=> setIsDropdownOpen(!isDropdownOpen)}
                    />
                </div>
            )}

            <div className="characters-view">
                {!hasData ? (
                    [...Array(TOTAL_PLACEHODLERS)].map((_,index) => (
                        <div key={index} className="character-placeholder-card"> </div>
                    ))
                ) : (
                    characters.map(char => <CharacterCard key={char.id} character={char} />)
                )}
            </div>
        </div>
    </div>

    );
}

export default CharactersView;