import './App.css';
import { useState, useRef } from 'react';
import Dropdown from './Dropdown';
import PillSelector from './PillSelector';

const legendOptions = [
    'All Legends', 'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
    'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];

const crewBasedViews = ['grandVoyage', 'garpsChallenge', 'forestOfTraining', 'pirateKingAdventures', 'treasureMap', 'kizunaClash'];

function Toolbar({
    viewMode,
    config,
    crewFilterValues,
    onCrewFiltersChange,
    characterCategory,
    onCharacterCategoryChange,
    totalCount,
    legendSubCategory,
    onLegendSubCategoryChange
}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isLegendDropdownOpen, setIsLegendDropdownOpen] = useState(false);

    const dropdownsRef = useRef([]);
    const legendDropdownRef = useRef(null);

    const getSelectedOptionLabel = () => {
        if(legendSubCategory === 'all'){
            return 'All Legends';
        }
        return legendSubCategory;
    };

    const handleLegendSubCategorySelect = (selection) => {
        const valueToUpdate = selection === 'All Legends' ? 'all' : selection;
        onLegendSubCategoryChange(valueToUpdate);
        setIsLegendDropdownOpen(false);
    }

   const renderFilterControl = (filterConfig, selectedValue, onSelect, isDependent = false) => {
    let options = filterConfig.options;
    if(isDependent){
        const parentFilterId = filterConfig.dependentOn;
        const parentValue = crewFilterValues[parentFilterId];
        options = parentValue ? filterConfig.optionsMap[parentValue] || [] : [];
    }

    if (options.length <= 7) {
        return(
            <PillSelector
                options={options}
                selectedOption={selectedValue}
                onSelect={(option) => onSelect({[filterConfig.id]: option})}
            />
        );
    } else {
        const dropdownId = filterConfig.id;
        const isOpen = openDropdown === dropdownId;
        const toggleDropdown = () => setOpenDropdown(isOpen ? null : dropdownId);

        return (
            <div ref={el => dropdownsRef.current.push(el)}>
                <Dropdown
                    options={options}
                    selectedOption={selectedValue}
                    placeholder={filterConfig.placeholder}
                    onSelect={(option) => {
                        onSelect({ [filterConfig.id]: option});
                        setOpenDropdown(null);
                    }}
                    isOpen={isOpen}
                    onToggle={toggleDropdown}
                />
            </div>
        );
    }
   };

    return (
        <div className="toolbar">
            {viewMode === 'characters' && (
                <>
                    <div className="toolbar-left">
                        {totalCount > 0 && (
                            <div className="results-counter">
                                {totalCount}/{totalCount}
                            </div>
                        )}
                        {characterCategory === 'legends' && (
                            <div className="sub-category-filter" ref={legendDropdownRef}>
                                <Dropdown
                                    options={legendOptions}
                                    selectedOption={getSelectedOptionLabel()}
                                    onSelect={handleLegendSubCategorySelect}
                                    isOpen={isLegendDropdownOpen}
                                    onToggle={()=> setIsLegendDropdownOpen(!isLegendDropdownOpen)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="toolbar-right">
                        <div className="character-category-buttons">
                            <button className={`header-button ${characterCategory === 'plusLegends' ? 'active' : ''}`}
                            onClick={()=> onCharacterCategoryChange('plusLegends')}>6+ Legends</button> 
                            <button className={`header-button ${characterCategory === 'legends' ? 'active' : ''}`}
                            onClick={()=> onCharacterCategoryChange('legends')}>Legends</button>
                            <button className={`header-button ${characterCategory === 'rareRecruits' ? 'active' : ''}`}
                            onClick={()=> onCharacterCategoryChange('rareRecruits')}>Rare Recruits</button>
                        </div>
                    </div>
                </>
            )}

            {crewBasedViews.includes(viewMode) && config?.dropdowns && (
                <div className="crew-controls">
                    {config.dropdowns.length > 0 && 
                        renderFilterControl(
                            config.dropdowns[0],
                            crewFilterValues[config.dropdowns[0].id],
                            onCrewFiltersChange
                        )}

                    {config.dropdowns.length >1 && crewFilterValues[config.dropdowns[0].id] &&
                        renderFilterControl(
                            config.dropdowns[1],
                            crewFilterValues[config.dropdowns[1].id],
                            onCrewFiltersChange,
                            !!config.dropdowns[1].dependentOn
                        )
                    }

        </div>
            )}
        </div>
    );
}

export default Toolbar;