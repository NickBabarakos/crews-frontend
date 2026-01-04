import { useRef} from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';


function Dropdown({options, selectedOption, onSelect, placeholder, isOpen, onToggle, className, disabled}){
    const dropdownRef= useRef(null);

    useOnClickOutside(dropdownRef, ()=> {
        if(isOpen){
            onToggle();
        }
    });

    const handleSelectOption = (e, option) => { 
        e.stopPropagation();
        onSelect(option);
    };

    const handleToggleClick = (e) => {
        e.stopPropagation();
        onToggle();
    };

    const handleMenuTouch = (e) => {
        e.stopPropagation();
    };



    return(
        <div 
            className={`dropdown ${className || ''} ${isOpen ? 'open' : ''}`} 
            ref={dropdownRef}
        >
            <button 
                className="dropdown-toggle" 
                onClick={handleToggleClick} 
                disabled={disabled}
                type="button"
            >
                <span title={selectedOption || placeholder}> {selectedOption || placeholder}</span>
                <svg className="dropdown-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {isOpen && (
            <ul className="dropdown-menu" onTouchStart={handleMenuTouch}> 
                {options.map(option =>(
                    <li
                    key={option}
                    onClick={(e)=> handleSelectOption(e, option)}
                    className={option === selectedOption ? 'selected' : ''}
                    title={option}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        )}
        </div>
    );
}
export default Dropdown;