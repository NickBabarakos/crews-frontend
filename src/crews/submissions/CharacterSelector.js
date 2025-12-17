import React, {useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios';
import './CharacterSelector.css';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_CHARACTERS_URL = `${BASE_URL}/api/characters`;

function CharacterSelector({onSelect, onBack}) {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const searchTimeout = useRef(null);
    const containerRef = useRef(null);

    const isMobile = window.innerWidth <=768;

    const pageSize = useResponsiveGrid(containerRef, {
        cardWidth: isMobile ? 65: 85,
        cardHeight: isMobile ? 65: 85,
        gap: 10,
        widthBuffer: 20,
        shouldKeepSquare: true
    });

    const fetchCharacters = useCallback(async (reset = false) => {
        if (loading) return;
        if(pageSize === 0 && !reset) return;
        setLoading(true);

        const currentPage = reset ? 1 : page;
        const calculatedLimit = pageSize > 0 ? Math.ceil((pageSize*3)/10)*10 : 60;
        const actualLimit = Math.max(calculatedLimit, 60);

        try{
            const response = await axios.get(API_CHARACTERS_URL, {
                params: {
                    page: currentPage,
                    limit: actualLimit,
                    type: 'ALL',
                    search: searchTerm
                }
            });

            const newChars = response.data.characters || [];

            setCharacters(prev=>reset ? newChars: [...prev, ...newChars]);
            setHasMore(response.data.hasMore);
            setPage(currentPage+1);
        } catch(err) {
            console.error("Error fetching characters", err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, loading, pageSize]);

    useEffect(()=> {
        fetchCharacters(true);
    }, [searchTerm]);

    const handleScroll = (e) => {
        const {scrollTop, clientHeight, scrollHeight} = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading){
            fetchCharacters(false);
        }
    };

    const handleSearchInput = (e) => {
        const val = e.target.value;
        if(searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(()=> {
            setSearchTerm(val);
            setPage(1);
        }, 500);
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg> 
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
                        src={`${char.image_url}.png`}
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