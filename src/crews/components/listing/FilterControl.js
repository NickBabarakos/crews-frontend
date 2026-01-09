import React from "react";
import Dropdown from "../../../components/common/Dropdown";
import PillSelector from "../../../components/common/PillSelector";

/**
 * GENERIC FILTER COMPONENT
 * -----------------------
 * A "dumb" component that renders either a PillSelector or a Dropdown bases on the 'type' prop provided by the parent.
 * 
 * Special Logic:
 * - Clean Value Display: For modes like PKA/TM, it strips suffixes like "(HEX)" or "(Boss)" 
 *   from the display value so the UI looks cleaner, while keeping the real value for the API.
 */

function FilterControl({
    id,
    type, //'pill' or 'dropdown'
    options,
    value,
    placeholder,
    onSelect,
    disabled,
    mode,

    //Pills Props
    scrollMode,
    onScroll,
    onWheel,
    pillRef,
    isMobileModal,

    //Dropdown Props
    isOpen,
    onToggle
}) {
    if (!options || options.length === 0) return null;

    const disabledStyle = disabled ? { opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)'} : {};

    if(type === 'pill'){
        // Logic: Clean up the display text for specific modes
        const displaySelectedValue = value;

        //Scroll Mask Logic (fade effect on edges)
        const maskClass = scrollMode === 'none'
            ? ''
            : (scrollMode === 'middle' ? 'mask-middle' : (scrollMode === 'end' ? 'mask-end' : 'mask-start'));
                
        return (
            //Render Pills
            <div style={disabledStyle} key={id}>
                {isMobileModal && <label style={{display:'block', marginBottom: '6px', fontSize:'12px', color:'var(--text-muted)'}}>{placeholder}</label>}
                
                <div 
                    className={`pills-scroll-wrapper ${maskClass}`} 
                    onWheel={onWheel}
                    onScroll={onScroll}
                    ref={pillRef}
                >
                            
                    <PillSelector 
                        options={options} 
                        selectedOption={displaySelectedValue} 
                        onSelect={(option) => {
                            onSelect({[id]: option});
                        }}
                    />
                </div>
            </div>
        );
    }
            
    return(
        //Render Dropdown
        <div>
            <Dropdown 
                options={options} 
                selectedOption={value} 
                placeholder={placeholder} 
                onSelect={(option) => {
                    onSelect({[id]: option }); 
                }} 
                isOpen={isOpen} 
                onToggle={onToggle}
                disabled={disabled}
            />
        </div>
        );
    }

export default FilterControl;