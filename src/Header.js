import './App.css';
import { useState, useEffect, useRef } from 'react';
import Dropdown from './Dropdown';

    const levelOptions = ['Level 1', 'Level 2', 'Level 3', 'Level 5'];
    const stageOptions = [
        'GV vs Local Sea Monster', 'GV vs Iron-Mace Alvida', 'GV vs Axe-Hand Morgan',
        'GV vs Buggy the Clown', 'GV vs (O.T.)Monkey D. Luffy', 'GV vs Captain Kuro',
        'GV vs Don Krieg', 'GV vs Hawk Eyes Mihawk', 'GV vs Roronoa Zoro',
        'GV vs Arlong', 'GV vs (A.P.)Moneky D. Luffy', 'GV vs (INT) Snoker',
        'GV vs (L)Monkey D. Luffy', 'GV vs Miss Wednesday', 'GV vs Mr.5',
        'GV vs Mr.3', 'GV vs Wapol', 'GV vs Wapol', 'GV vs (DEX)Smoker', 'GV vs Miss Doublefinger'
    ];

function Header( { viewMode, onSearch, characterCategory, onCharacterCategoryChange }){
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    const levelDropdownRef = useRef(null);
    const stageDropdownRef = useRef(null);

    const handleToggleDropdown = (dropdownId) =>{
        setOpenDropdown(currentOpen => (currentOpen === dropdownId ? null: dropdownId));
    };

    useEffect( ()=> {
        if(openDropdown === null) return;

        function handleClickOutside(event){
            if(
                levelDropdownRef.current && !levelDropdownRef.current.contains(event.target) &&
                stageDropdownRef.current && !stageDropdownRef.current.contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown",handleClickOutside);
    }; }, [openDropdown]);

    const handleSearch = ()=> {
        if(!selectedLevel || !selectedStage) {
            alert(`Please select both a level and a stage`);
            return;
        }
    const levelNumber = selectedLevel.replace('Level ', '');
    onSearch({
        stage: selectedStage,
        level: levelNumber
    });
    };

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
        setOpenDropdown(null);
    };

    const handleStageSelect = (stage) => {
        setSelectedStage(stage);
        setOpenDropdown(null);
    };

    return(
        <div className="header-bar">
            <h1> otpc-crews </h1>

            <div className="header-controls">
                {viewMode === `grandVoyage` ? (
                    <>
                        <div ref={stageDropdownRef}>
                            <Dropdown 
                                className="header-dropdown"
                                options={stageOptions}
                                selectedOption={selectedStage}
                                onSelect={handleStageSelect}
                                placeholder="Select Stage"
                                isOpen={openDropdown === 'stage'}
                                onToggle={()=> handleToggleDropdown('stage')}
                            />
                        </div>
                        <div ref={levelDropdownRef}>
                            <Dropdown 
                                className="header-dropdown"
                                options={levelOptions}
                                selectedOption={selectedLevel}
                                onSelect={handleLevelSelect}
                                placeholder="Level"
                                isOpen={openDropdown === 'level'}
                                onToggle={()=> handleToggleDropdown('level')}
                            />
                        </div>
                        <button className="search-button" onClick={handleSearch}>Search</button>
                    </>
                ):(
                    <div className="character-category-buttons">
                        <button 
                            className={`header-button ${characterCategory === 'plusLegends' ? 'active' : ''}`}
                            onClick={() => onCharacterCategoryChange('plusLegends')}
                        > 6+ Legends 
                        </button>
                        <button 
                            className = {`header-button ${characterCategory === 'legends' ? 'active' : ''}`}
                            onClick={()=> onCharacterCategoryChange('legends')}
                        > Legends
                        </button>
                        <button
                            className={`header-button ${characterCategory === 'rareRecruits' ? 'active' : ''}`}
                            onClick = {()=> onCharacterCategoryChange('rareRecruits')}
                        > Rare Recruits
                        </button>
                    </div>
                )}

            </div>
    </div>

    )
}

export default Header;