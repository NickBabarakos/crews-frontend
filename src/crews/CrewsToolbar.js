import '../Toolbar.css';
import {useState, useRef, useMemo} from 'react';
import Dropdown from '../Dropdown';
import PillSelector from '../PillSelector';
import FilterModal from '../FilterModal';

function CrewsToolbar({config, crewFilterValues, onCrewFiltersChange, onOpenGuide, showOnlyOwned, onToggleOwned, showActions, disabled, sortBy, onToggleSort}){
    const [openToolbarDropdown, setOpenToolbarDropdown] = useState(null);
    const [openModalDropdown, setOpenModalDropdown] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const dropdownsRef = useRef([]);

    const SortIcon = () => (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <path d="M8.46967 17.5303C8.76256 17.8232 9.23744 17.8232 9.53033 17.5303C9.82322 17.2374 9.82322 16.7626 9.53033 16.4697L8.46967 17.5303ZM6 14V13.25C5.69665 13.25 5.42318 13.4327 5.30709 13.713C5.191 13.9932 5.25517 14.3158 5.46967 14.5303L6 14ZM18 14.75C18.4142 14.75 18.75 14.4142 18.75 14C18.75 13.5858 18.4142 13.25 18 13.25V14.75ZM15.5303 6.46967C15.2374 6.17678 14.7626 6.17678 14.4697 6.46967C14.1768 6.76256 14.1768 7.23744 14.4697 7.53033L15.5303 6.46967ZM18 10V10.75C18.3033 10.75 18.5768 10.5673 18.6929 10.287C18.809 10.0068 18.7448 9.68417 18.5303 9.46967L18 10ZM6 9.25C5.58579 9.25 5.25 9.58579 5.25 10C5.25 10.4142 5.58579 10.75 6 10.75L6 9.25ZM9.53033 16.4697L6.53033 13.4697L5.46967 14.5303L8.46967 17.5303L9.53033 16.4697ZM6 14.75H18V13.25H6V14.75ZM14.4697 7.53033L17.4697 10.5303L18.5303 9.46967L15.5303 6.46967L14.4697 7.53033ZM18 9.25H6L6 10.75H18V9.25Z" fill="currentColor"></path> 
        </svg>
    );

    const {mobileLayoutStrategy, isPillsOnly } = useMemo(()=> {
        let dropdownCount = 0;
        let pillCount = 0;
        if (!config?.dropdowns) return {mobileLayoutStrategy: 'collapse-all', isPillsOnly: false};

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
                        <button 
                                className={`stage-guide-btn ${sortBy === 'owned' ? 'active-sort': ''}`}
                                onClick={onToggleSort}
                                style={{gap: '8px', padding: '8px 14px'}}
                            >
                                <SortIcon/>
                                <span>Sort By: {sortBy === 'default' ? 'Default': 'Owned'}</span>
                            </button>
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
                {showActions && (
                    <div className="modal-sort-section">
                        <label className="mobile-filter-label">Sorting</label>
                        <button 
                            className={`pill-button mobile-sort-btn ${sortBy === 'owned' ? 'active-sort' : ''}`}
                            onClick={onToggleSort}
                        >
                            <SortIcon/>
                            Sort By: {sortBy === 'default' ? 'Default' : 'Owned'}</button>
                    </div>
                )}
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