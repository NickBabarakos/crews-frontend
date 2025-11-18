import { useState, useEffect, useRef} from 'react';


function Dropdown({options, selectedOption, onSelect, placeholder, isOpen, onToggle, className}){
    const [dropdownWidth, setDropdownWidth] = useState(null);
    const dropdownRef= useRef(null);

    useEffect(() => {
        if(options && options.length>0 && dropdownRef.current) {
            const longestOption = options.reduce((a,b) => a.length > b.length ? a:b, "");
            const tempSpan = document.createElement('span');
            document.body.appendChild(tempSpan);

            const buttonStyle = window.getComputedStyle(dropdownRef.current.querySelector('.dropdown-toggle'));
            tempSpan.style.font = buttonStyle.font;
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.innerText = longestOption;

            const calculatedWidth = tempSpan.offsetWidth + 40;
            setDropdownWidth(calculatedWidth);

            document.body.removeChild(tempSpan);
        }
    }, [options]);

    const handleSelectOption = (option) =>{
        onSelect(option);
    }
   

    return(
        <div className={`dropdown ${className || ''}`}
            ref={dropdownRef}
            style={{ width: dropdownWidth ? `${dropdownWidth}px` : `auto`}}
        >
            <button className="dropdown-toggle" onClick={onToggle}>
                {selectedOption || placeholder}
            </button>

            {isOpen && (
            <ul className="dropdown-menu">
                {options.map(option =>(
                    <li
                    key={option}
                    onClick={()=> handleSelectOption(option)}
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