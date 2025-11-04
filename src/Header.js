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

function Header( { onSearch }){
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
   

    return(
        <div className="header-bar">
            <h1> Crews </h1>
            <div ref={levelDropdownRef}>
                <Dropdown
                    options={levelOptions}
                    selectedOption = {selectedLevel}
                    onSelect={setSelectedLevel}
                    placeholder = "Selecet Level"
                    isOpen={openDropdown === 'level'}
                    onToggle={()=> handleToggleDropdown('level')}
                />
            </div>
            <div ref={stageDropdownRef}>
                <Dropdown
                    options={stageOptions}
                    selectedOption={selectedStage}
                    onSelect={setSelectedStage}
                    placeholder="Select Stage"
                    isOpen={openDropdown === 'stage'}
                    onToggle={()=> handleToggleDropdown('stage')}
                />
            </div>
            <button className="search-button" onClick={handleSearch}>Search</button>

        </div>

    )
}

export default Header;