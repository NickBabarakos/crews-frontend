import { useRef} from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { ChevronDownIcon } from '../Icons';


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
        onToggle();
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
                <ChevronDownIcon className="dropdown-chevron"/>
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