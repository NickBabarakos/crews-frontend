
function Dropdown({options, selectedOption, onSelect, placeholder, isOpen, onToggle}){

    const handleSelectOption = (option) =>{
        onSelect(option);
    }
   

    return(
        <div className="dropdown">
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