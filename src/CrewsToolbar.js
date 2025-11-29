import './Toolbar.css';
import {useState, useRef } from 'react';
import Dropdown from './Dropdown';
import PillSelector from './PillSelector';

function CrewsToolbar({config, crewFilterValues, onCrewFiltersChange, onOpenGuide, showOnlyOwned, onToggleOwned, showActions, disabled}){
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownsRef = useRef([]);

    const renderFilterControl = (filterConfig, selectedValue, onSelect, isDependent = false) => {
        let options = filterConfig.options;
        if (isDependent){
            const parentFilterId = filterConfig.dependentOn;
            const parentValue = crewFilterValues[parentFilterId];
            options = parentValue ? filterConfig.optionsMap[parentValue] || [] : [];
        }
        if(!options || options.length === 0) return null;

        const disabledStyle = disabled ? { opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)'} : {};

        if(options.length <= 5) {
            return (
                    <div style={disabledStyle}>
                        <PillSelector options={options} selectedOption={selectedValue} onSelect={(option) => onSelect({
                [filterConfig.id]:option })} />
                </div>
                 );
            } else {
                const dropdownId = filterConfig.id;
                const isOpen = openDropdown === dropdownId;
                const toggleDropdown = () => setOpenDropdown(isOpen ? null: dropdownId);

                return (
                    <div ref={el => dropdownsRef.current.push(el)}>
                        <Dropdown options={options} selectedOption={selectedValue} placeholder={filterConfig.placeholder} onSelect=
                        {(option) => {onSelect({[filterConfig.id]: option }); setOpenDropdown(null); }} isOpen={isOpen} onToggle={toggleDropdown} />
                    </div>
                );
            }
        };

        const handleGuideClick = () => {
            if(onOpenGuide){
                onOpenGuide();
            }
        };

        return(
            <div className="crew-controls">
                <div className="filters-container">
                    {config.dropdowns.map((filter, index) => (
                        <div className="filter-group" key={filter.id}>
                            <label>{filter.placeholder}</label>
                            {renderFilterControl (
                                filter,
                                crewFilterValues[filter.id],
                                onCrewFiltersChange,
                                index > 0 && !!filter.dependentOn
                            )}
                        </div>
                    ))}
                </div>
            {showActions && (
            <div className="toolbar-actions" style={{display: 'flex', gap: '12px'}}>
                <button 
                    className={`icon-toggle-btn ${showOnlyOwned ? 'active' : ''}`}
                    onClick={onToggleOwned}
                    title={showOnlyOwned ? "Showing Only Complete Crews" : "Filter by My Characters"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"> 
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <polyline points="17 11 19 13 23 9"></polyline>    
                    </svg>
                </button>

                <button className="stage-guide-btn" onClick={handleGuideClick}>
                    <svg 
                        width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.253V19.25M12 6.253C10.588 5.48 8.657 5 6.5 5C4.195 5 2.127 5.568 0.548 6.536C0.207 6.746 0 7.108 0 7.508V20.662C0 21.282 0.655 21.678 1.207 21.365C2.696 20.52 4.673 20 6.5 20C8.657 20 10.588 20.48 12 21.253M12 6.253C13.412 5.48 15.343 5 17.5 5C19.805 5 21.873 5.568 23.452 6.536C23.793 6.746 24 7.108 24 7.508V20.662C24 21.282 23.345 21.678 22.793 21.365C21.304 20.52 19.327 20 17.5 20C15.343 20 13.412 20.48 12 21.253"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Guide</span>
                </button>
            </div>
            )}
        </div>
        );
    }
export default CrewsToolbar;