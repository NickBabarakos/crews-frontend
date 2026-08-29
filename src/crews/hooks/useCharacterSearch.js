import { useState, useCallback, useRef, useEffect } from "react";
import { getCharacters } from "../../api/characterService";

export const useCharacterSearch = (pageSize) => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const searchTimeout = useRef(null);
    const abortControllerRef = useRef(null);
    const loadingRef = useRef(false);

    // API Fetcher
    const fetchCharacters = useCallback(async (reset = false, customSearch = null) => {
        // Αν δεν είναι reset και ήδη φορτώνει, αγνόησέ το (infinite scroll)
        if (!reset && loadingRef.current) return;

        // Αν είναι νέο search/reset, ακυρώνουμε το προηγούμενο pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        loadingRef.current = true;
        setLoading(true);

        const activeSearch = customSearch !== null ? customSearch : searchTerm;
        const currentPage = reset ? 1 : page;
        const actualLimit = 100; // 100 είναι αρκετά για γρήγορο rendering

        try {
            const data = await getCharacters({
                page: currentPage,
                limit: actualLimit,
                type: 'ALL',
                search: activeSearch,
                signal: abortControllerRef.current.signal // Αν το υποστηρίζει το axios/fetch service σου
            });

            const newChars = data?.characters || [];

            setCharacters(prev => reset ? newChars : [...prev, ...newChars]);
            setHasMore(Boolean(data?.hasMore));
            setPage(currentPage + 1);
        } catch (err) {
            // Αγνοούμε το σφάλμα αν προήλθε από abort
            if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                console.error("Error fetching characters", err);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [page, searchTerm]);

    // Search Handler (Debounced)
    const handleSearch = (val) => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            setSearchTerm(val);
            setPage(1);
            // Καλεί απευθείας το fetch με reset=true και τη νέα τιμή
            fetchCharacters(true, val);
        }, 300); // 300ms είναι πιο responsive από 500ms
    };

    // Αρχικό fetch μόνο στο mount
    useEffect(() => {
        fetchCharacters(true, '');
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        characters,
        loading,
        hasMore,
        fetchCharacters,
        handleSearch
    };
};