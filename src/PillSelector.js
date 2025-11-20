import './App.css';

function PillSelector({options, selectedOption, onSelect}){
    return(
        <div className="pill-selector">
            {options.map(option => (
                <button
                    key={option}
                    className={`pill-button ${option === selectedOption ? 'active' : ''}`}
                    onClick={()=> onSelect(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default PillSelector;
