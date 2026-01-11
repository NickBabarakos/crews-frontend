import React, {useRef, useEffect} from 'react';
import './CharacterSelector.css';
import { useResponsiveGrid } from '../../../hooks/useResponsiveGrid';
import { BackIcon } from '../../../components/Icons';
import {useCharacterSearch} from '../../hooks/useCharacterSearch';
import { getImageUrl } from '../../../utils/imageUtils';

/**
 * CHARACTER SEARCH MODAL
 * ----------------------
 * A searchable, infinite-scrolling grid for selecting units.
 * 
 * Key Features:
 * 1. Infinite Scroll: Detects when user reaches bottom of grid to fetch next page.
 * 2. Debounced Search: Handled by the hook logic to prevent API spam.
 * 3. Responsive Grid: Uses 'useResponsiveGrid' to fit cards perfectly on any scerren.
 */

function CharacterSelector({onSelect, onBack}) {
    const containerRef = useRef(null);
    const isMobile = window.innerWidth <=768;

    const pageSize = useResponsiveGrid(containerRef, {
        cardWidth: isMobile ? 65: 85,
        cardHeight: isMobile ? 65: 85,
        gap: 10,
        widthBuffer: 20,
        shouldKeepSquare: true
    });

    const {
        characters,
        loading,
        hasMore,
        fetchCharacters,
        handleSearch 
    } = useCharacterSearch(pageSize);

    useEffect(()=> {
        const node = containerRef.current;
        if(!node || loading || !hasMore || characters.length === 0) return;

        if(node.scrollHeight <= node.clientHeight){
            fetchCharacters(false);
        }
    }, [characters, hasMore, loading, fetchCharacters]);


    const handleScroll = (e) => {
        const {scrollTop, clientHeight, scrollHeight} = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading){
            fetchCharacters(false);
        }
    };

    const handleSearchInput = (e) => {
        handleSearch(e.target.value);
    };

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.target.blur();
        }
    };

    return(
        <div className='selector-container'>
            <div className="selector-header">
                <button className="back-arrow-btn" onClick={onBack}>
                    <BackIcon/>
                        Back
                </button>

                <div className="selector-search-wrapper">
                    <input 
                        type="text"
                        placeholder="Search Character..."
                        className="selector-search-input"
                        onChange={handleSearchInput}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <div 
                className="selector-grid"
                ref={containerRef}
                onScroll={handleScroll}
            >{characters.map(char => (
                <div
                    key={char.id}
                    className="selector-card"
                    onClick={()=>onSelect(char)}
                >
                    <img 
                        src={getImageUrl(`${char.image_url}.png`)}
                        alt={char.name}
                        loading="lazy"
                    />
                </div>
            ))}

            {loading && <div className="selector-loader">Loading...</div>}
            {!loading && characters.length === 0 && (
                <div className="selector-empty">No characters found.</div>
            )}
        </div>
    </div>
    );
}

export default CharacterSelector;