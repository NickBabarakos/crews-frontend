import { useRef} from 'react';
import useOnClickOutside from './useOnClickOutside';


function Dropdown({options, selectedOption, onSelect, placeholder, isOpen, onToggle, className, disabled}){
    const dropdownRef= useRef(null);

    useOnClickOutside(dropdownRef, ()=> {
        if(isOpen){
            onToggle();
        }
    });

    const handleSelectOption = (option) => { onSelect(option);};



    return(
        <div className={`dropdown ${className || ''} ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={onToggle} disabled={disabled}>
                <span title={selectedOption || placeholder}> {selectedOption || placeholder}</span>
                <svg className="dropdown-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="https://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {isOpen && (
            <ul className="dropdown-menu">
                {options.map(option =>(
                    <li
                    key={option}
                    onClick={()=> handleSelectOption(option)}
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