import '../../../components/Toolbar.css';
import FilterModal from '../modals/FilterModal';
import FilterControl from './FilterControl';
import { useCrewsToolbarLogic } from '../../hooks/useCrewsToolbarLogic';
import { SortIcon, FilterIcon, GuideIcon } from '../../../components/Icons';

/**
 * MAIN TOOLBAR COMPONENT 
 * ----------------------
 * The control center for the Crews Page.
 * 
 * Key Responsibilities:
 * 1. Render layout based on data provided by `useCrewsToolbarLogic`
 * 2. Display Sort/MyBox actions.
 */

function CrewsToolbar(props){
    // 1. Destructure Logic from Custom Hook
    const{
        firstFilter, isFirstBig, scrollableFilters, allFilters,
        mobileLayoutStrategy, isFilterModalOpen,
        openFilterModal, closeFilterModal, getModalFilterProps
    } = useCrewsToolbarLogic(props);

    // 2. Destructure UI props passed by Parent
    const{
        showActions, disabled, sortBy, onToggleSort,
        onOpenGuide, showOnlyOwned, onToggleOwned
    } = props;


        return(
            <div className="crew-controls">
                {!disabled && (
                    <div 
                        className={`filters-container ${mobileLayoutStrategy === 'collapse-all' ? 'hide-on-mobile': ''}`}
                        >
                            {/* Render Fixed Filter (like 'Select Challenge)' */}
                            {isFirstBig && firstFilter && (
                                <div className="fixed-filter-group">
                                    <FilterControl {...firstFilter} />
                                </div>
                            )}

                            {/* Render Scrollable Filters (Pills or secondary dropdowns) */}
                            <div className="scrollable-filters-list">
                                {scrollableFilters.map((filter) => (
                                    <div className="filter-group" key={filter.id}>
                                        <FilterControl {...filter} />
                                    </div> 
                                ))}
                            </div>
                    </div>
                            
                )}
               
                {/*Mobile Filter Button */}
                {mobileLayoutStrategy === 'collapse-all' &&  (
                    <div className={`mobile-toolbar-grid show-on-mobile-only ${disabled ? 'stage-mode' : ''}`} >
                        {!disabled ? (
                            <button className="mobile-filter-btn" onClick={openFilterModal}>
                                <FilterIcon/>
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
                        <GuideIcon/>
                        <span>Guide</span>
                    </button>
                    </>
                )}
            </div>
            )}

                {/* Desktop Action Buttons */}
                {showActions &&( 
                    <div className="toolbar-actions hide-on-mobile">
                        <div className="actions-group">
                            <button 
                                className={`stage-guide-btn ${sortBy === 'owned' ? 'active-sort': ''}`}
                                onClick={onToggleSort}
                                style={{gap: '8px', padding: '8px 14px'}}
                            >
                                <SortIcon style={{marginRight: '8px'}}/>
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
                            <GuideIcon/>
                            <span>Guide</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Modal (Mobile)*/}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={closeFilterModal}
                title="Filter Stages"
            >
                {showActions && (
                    <div className="modal-sort-section">
                        <label className="mobile-filter-label">Sorting</label>
                        <button 
                            className={`pill-button mobile-sort-btn ${sortBy === 'owned' ? 'active-sort' : ''}`}
                            onClick={onToggleSort}
                        >
                            <SortIcon style={{marginRight: '8px'}}/>
                            Sort By: {sortBy === 'default' ? 'Default' : 'Owned'}</button>
                    </div>
                )}

                {/*Render ALL Filters inside Modal using Helper Function for props */}
                {allFilters.map((filter, index) => (
                    <FilterControl
                        key={filter.id}
                       {...getModalFilterProps(filter)}
                    />
                ))}
            </FilterModal>
        </div>
        );
    }
export default CrewsToolbar;