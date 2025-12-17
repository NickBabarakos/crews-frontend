import { useRef, useEffect, useState, memo } from 'react';
import {useCollection} from '../CollectionContext';
import './CharactersView.css';
import { useResponsiveGrid } from '../hooks/useResponsiveGrid';
import InteractiveChar from '../InteractiveChar';


const CharacterCard = memo(({character, isMobile}) =>{
    const {isOwned, toggleChar } = useCollection();
    const owned = isOwned(character.id);

    return(
        <InteractiveChar 
            id={character.id}
            type={character.type}
            url={character.info_url}
            className={`character-card ${owned ? '' : 'missing'}`}
            title={character.name}
        >
            <img src={`${character.image_url}.png`} alt={character.name} style={{pointerEvents: 'none'}} />
        </InteractiveChar>
    );
});



function CharactersView({ characters, onPageSizeChange }){
    const gridRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    

    useEffect(()=> {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize', handleResize);
    }, []);
    
    const calculatedSize = useResponsiveGrid(gridRef, {
        cardWidth: isMobile ? 75: 110,
        cardHeight: 0,
        gap: isMobile ? 8 : 12,
        shouldKeepSquare: true,
        widthBuffer: 10,
        heightBuffer: isMobile ? 20:5
    });

    useEffect(()=> {
        if(calculatedSize > 0) onPageSizeChange(calculatedSize);
    }, [calculatedSize, onPageSizeChange]);

    return (
        <>
            <div className = "characters-view" ref={gridRef}>
                {characters && characters.map(char => <CharacterCard key={char.id} character={char} isMobile={isMobile} />)}
            </div>
    
        </>
    );
}

export default CharactersView;