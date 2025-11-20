import './App.css';
import { useRef, useEffect, useCallback } from 'react';


function CharacterCard({character}){
    return(
        <a href={character.info_url} target="_blank" rel="noopener noreferrer" className="character-card">
            <img src={`${character.image_url}.png`} alt={character.name} />
        </a>
    );
}



function CharactersView({ characters, onPageSizeChange }){
    const gridRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const calculatePageSize = useCallback(()=> {
        if(!gridRef.current) return;

        const gridStyle = window.getComputedStyle(gridRef.current);
        const cardMinWidth = 110;
        const gap = parseInt(gridStyle.gap) || 15;

        const containerWidth = gridRef.current.clientWidth;
        const containerHeight = gridRef.current.clientHeight;

        if (containerWidth === 0) return;

        const columns = Math.floor(containerWidth / (cardMinWidth + gap));
        if(columns === 0) return;

        const cardHeight = (containerWidth - (columns-1)*gap)/columns;
        const rows = Math.floor(containerHeight/(cardHeight + gap));
        
        const newSize =columns*rows;

        if(newSize <=0 ){
            onPageSizeChange(Math.max(1, columns));
            return;    
        }

        onPageSizeChange(newSize);
    }, [onPageSizeChange]);

    useEffect(()=> {
        const observer = new ResizeObserver(()=> {
            clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(()=> {
                calculatePageSize();
            }, 150);
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