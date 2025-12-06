import './Toolbar.css';
import {useState, useRef, useMemo} from 'react';
import Dropdown from './Dropdown';
import PillSelector from './PillSelector';
import FilterModal from './FilterModal';

function CrewsToolbar({config, crewFilterValues, onCrewFiltersChange, onOpenGuide, showOnlyOwned, onToggleOwned, showActions, disabled}){
    const [openToolbarDropdown, setOpenToolbarDropdown] = useState(null);
    const [openModalDropdown, setOpenModalDropdown] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const dropdownsRef = useRef([]);

    const {mobileLayoutStrategy, isPillsOnly } = useMemo(()=> {
        let dropdownCount = 0;
        let pillCount = 0;

        config.dropdowns.forEach(filter => {
            const isPill = filter.options?.length <= 5 && !filter.dependentOn;
            if(isPill) pillCount++;
            else dropdownCount++;
        });

        const _isPillsOnly = dropdownCount === 0 && pillCount > 0;

        if (dropdownCount === 0 && pillCount === 4) return {mobileLayoutStrategy: 'keep-pills', isPillsOnly: _isPillsOnly};

        return {mobileLayoutStrategy: 'collapse-all', isPillsOnly: _isPillsOnly};
    }, [config]);

    const renderFilterControl = (filterConfig, selectedValue, onSelect, isDependent = false, isMobileModal=false) => {
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
                    <div style={disabledStyle} key={filterConfig.id}>
                        {isMobileModal && <label style={{display:'block', marginBottom: '6px', fontSize:'12px', color:'#94a3b8'}}>
                            {filterConfig.placeholder}</label>}
                        <PillSelector options={options} selectedOption={selectedValue} onSelect={(option) => onSelect({
                [filterConfig.id]:option })} />
                </div>
                 );
            } else {
                const dropdownId = filterConfig.id;
                const activeId = isMobileModal ? openModalDropdown : openToolbarDropdown;
                const setActiveId = isMobileModal ? setOpenModalDropdown : setOpenToolbarDropdown;

                const isOpen = activeId === dropdownId;
                const toggleDropdown = () => setActiveId(isOpen ? null: dropdownId);

                return (
                    <div ref={el => dropdownsRef.current.push(el)}>
                        <Dropdown 
                            options={options} 
                            selectedOption={selectedValue} 
                            placeholder={filterConfig.placeholder} 
                            onSelect={(option) => {
                                onSelect({[filterConfig.id]: option }); 
                                setActiveId(null); }} 
                            isOpen={isOpen} 
                            onToggle={toggleDropdown} />
                    </div>
                );
            }
        };

        return(
            <div className="crew-controls">
                {!disabled && (
                    <div className={`filters-container ${isPillsOnly ? 'scrollable-pills-container' : ''} ${mobileLayoutStrategy === 'collapse-all' ? 'hide-on-mobile': ''}`}>
                        {config.dropdowns.map((filter, index) => (
                            <div className="filter-group" key={filter.id}>
                                {!isPillsOnly && <label>{filter.placeholder}</label>}
                                {renderFilterControl (
                                    filter,
                                    crewFilterValues[filter.id],
                                    onCrewFiltersChange,
                                    index>0 && !!filter.dependentOn,
                                    false
                            )}
                        </div>
                    ))}
                </div>
                )}

                {mobileLayoutStrategy === 'collapse-all' &&  (
                    <div className={`mobile-toolbar-grid show-on-mobile-only ${disabled ? 'stage-mode' : ''}`} >
                    {!disabled ? (
                        <button className="mobile-filter-btn" onClick={()=> setIsFilterModalOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points = "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                            Filters
                        </button>
                    ):(
                        <div/>
                    )}
                
            {showActions && (
                <>
                    <div className="my-box-toggle-wrapper">
                        <div className="switch-label vertical" onClick={(e)=> {
                            if(e.target.tagName !== 'INPUT'){ onToggleOwned();}
                        }}>
                            <span className="label-text">My Box</span>
                            <div className="toggle-switch small">
                                <input 
                                    type="checkbox"
                                    checked={showOnlyOwned}
                                    onChange={()=>{}}
                                    onClick={(e)=> {
                                        e.stopPropagation();
                                        onToggleOwned();
                                    }}
                                />
                            <span className="slider round"></span>
                        </div>
                </div>
                </div>

                <button className="stage-guide-btn mobile-guide-btn" onClick={onOpenGuide}>
                    <svg 
                        width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.253V19.25M12 6.253C10.588 5.48 8.657 5 6.5 5C4.195 5 2.127 5.568 0.548 6.536C0.207 6.746 0 7.108 0 7.508V20.662C0 21.282 0.655 21.678 1.207 21.365C2.696 20.52 4.673 20 6.5 20C8.657 20 10.588 20.48 12 21.253M12 6.253C13.412 5.48 15.343 5 17.5 5C19.805 5 21.873 5.568 23.452 6.536C23.793 6.746 24 7.108 24 7.508V20.662C24 21.282 23.345 21.678 22.793 21.365C21.304 20.52 19.327 20 17.5 20C15.343 20 13.412 20.48 12 21.253"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Guide</span>
                </button>
            </>
            )}
            </div>
            )}

            {showActions &&( 
                <div className="toolbar-actions hide-on-mobile">
                    <div className="actions-group">
                        <div className="my-box-toggle-wrapper">
                            <label className="switch-label">
                                <span className="label-text">My Box</span>
                                <div className="toggle-switch">
                                    <input 
                                        type="checkbox"
                                        checked={showOnlyOwned}
                                        onChange={onToggleOwned}
                                    />
                                    <span className="slider round"></span>
                                </div>
                            </label>

                        </div>

                        <button className="stage-guide-btn" onClick={onOpenGuide}>
                            <svg 
                                width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.253V19.25M12 6.253C10.588 5.48 8.657 5 6.5 5C4.195 5 2.127 5.568 0.548 6.536C0.207 6.746 0 7.108 0 7.508V20.662C0 21.282 0.655 21.678 1.207 21.365C2.696 20.52 4.673 20 6.5 20C8.657 20 10.588 20.48 12 21.253M12 6.253C13.412 5.48 15.343 5 17.5 5C19.805 5 21.873 5.568 23.452 6.536C23.793 6.746 24 7.108 24 7.508V20.662C24 21.282 23.345 21.678 22.793 21.365C21.304 20.52 19.327 20 17.5 20C15.343 20 13.412 20.48 12 21.253"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Guide</span>
                        </button>
                    </div>
                </div>
            )}

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={()=> setIsFilterModalOpen(false)}
                title="Filter Stages"
            >
                {config.dropdowns.map((filter, index) => (
                    renderFilterControl (
                        filter,
                        crewFilterValues[filter.id],
                        onCrewFiltersChange,
                        index>0 && !!filter.dependentOn,
                        true
                    )
                ))}
            </FilterModal>
        </div>
        );
    }
export default CrewsToolbar;