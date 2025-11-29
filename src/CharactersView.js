import { useRef, useEffect, useCallback } from 'react';
import {useCollection} from './CollectionContext';
import './CharactersView.css';


function CharacterCard({character}){
    const {isOwned, toggleChar } = useCollection();
    const owned = isOwned(character.id);

    return(
        <a
         href={character.info_url}
        target="_blank" 
        rel="noopener noreferrer" 
        className={`character-card ${owned ? '': 'missing'}`}
        onContextMenu={(e)=> {
            e.preventDefault();
            toggleChar(character.id, character.type);
        }}
        >
            <img src={`${character.image_url}.png`} alt={character.name} />
        </a>
    );
}



function CharactersView({ characters, onPageSizeChange }){
    const gridRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const calculatePageSize = useCallback(()=> {
        if(!gridRef.current) return;

        const containerWidth = gridRef.current.clientWidth;
        const containerHeight = gridRef.current.clientHeight;
        const cssPaddingX = 30;
        const cssPaddingY = 30;
        const availableWidth = containerWidth - cssPaddingX;
        const availableHeight = containerHeight - cssPaddingY;
        const cardMinWidth = 110;
        const gap = 12;

        if(availableWidth <=0 || availableHeight <= 0) return;

        const columns = Math.floor((availableWidth + gap)/(cardMinWidth + gap));
        if(columns<= 0) return;

        const actualCardWidth = (availableWidth - (columns-1)*gap)/columns;
        const rowHeight=actualCardWidth;
        const rows = Math.floor((availableHeight+gap)/(rowHeight+gap))+1;
        const newSize = columns*Math.max(1,rows);

        if(newSize > 0){
            onPageSizeChange(newSize);
        }

    }, [onPageSizeChange]);

    useEffect(()=> {
        calculatePageSize();

        const observer = new ResizeObserver(()=> {
            clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(()=> {
                calculatePageSize();
            }, 100);
        });

        if(gridRef.current){
            observer.observe(gridRef.current);
        }

        return ()=> {
            observer.disconnect();
            clearTimeout(resizeTimeoutRef.current);
        };
    }, [calculatePageSize]);


    return (
        <>
            <div className = "characters-view" ref={gridRef}>
                {characters && characters.map(char => <CharacterCard key={char.id} character={char} />)}
            </div>
    
        </>
    );
}

export default CharactersView;