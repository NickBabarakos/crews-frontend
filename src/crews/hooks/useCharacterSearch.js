import { useState, useCallback, useRef, useEffect } from "react";
import { getCharacters } from "../../api/characterService";

/**
 * SEARCH LOGIC HOOK
 * -----------------
 * Manages pagination and searching for the Character Selector
 * 
 * Logic:
 * - Debouncing: Waits 500ms after user stops trying before calling API.
 * - Pagination: Appends new results to the existing list (Infinite Scroll style)
 * - Reset: When search term changes, clears list and resets to Page 1.
 */
export const useCharacterSearch = (pageSize) => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const searchTimeout = useRef(null);

    // API Fetcher
    const fetchCharacters = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);
    
        const currentPage = reset ? 1 : page;
        const actualLimit = 300;
    
        try{
            const data = await getCharacters ({
                page: currentPage,
                limit: actualLimit,
                type: 'ALL',
                search: searchTerm
        });
    
        const newChars = data.characters || [];
    
        setCharacters(prev=>reset ? newChars: [...prev, ...newChars]);
        setHasMore(data.hasMore);
        setPage(currentPage+1);
    } catch(err) {
        console.error("Error fetching characters", err);
    } finally {
        setLoading(false);
    }
    }, [page, searchTerm, loading]);

    // Search Handler (Debounced)
    const handleSearch = (val) => {
        if(searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(()=> {
            setSearchTerm(val);
            setPage(1);
        }, 500);
    };

    // Trigger fetch on search change
    useEffect(()=> {
        fetchCharacters(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    return{
        characters,
        loading,
        hasMore,
        fetchCharacters,
        handleSearch
    };
};