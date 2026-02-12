import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { useBoxPersistence } from './useBoxPersistence';
import { useBoxApi } from './useBoxApi';

const CollectionContext = createContext();

const ALL_LEGEND_TYPES_DB = [
  'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 
  'Pirate Alliance Kizuna Clash Sugo-Fest Only', 'Exchange Only', 'Sugo Rare'
];
const ALL_RR_TYPES_DB = [
  'Rare Recruit', 'Treasure Map Rare Recruit', 'Treasure Map Limited Character', 'Kizuna Clash Limited Character',
  'Rumble Rare Recruit', 'Support Character'
];

const RR_MAPPING_DB = {
  'Treasure Map Rare Recruits': 'Treasure Map Rare Recruit',
  'Treasure Map Limited Characters': 'Treasure Map Limited Character',
  'Kizuna Clash Limited Characters': 'Kizuna Clash Limited Character',
  'Rumble Rare Recruits': 'Rumble Rare Recruit',
  'Support Characters': 'Support Character',
  'Other Rare Recruits': 'Rare Recruit'
};


const normalizeType = (input) => {
    if(!input) return '';

    if(Array.isArray(input)) {
        return String(input[0]).trim();
    }

    return String(input).trim();
};

/**
 * GLOBAL STATE: COLLECTION CONTEXT
 * -------------------------------
 * The "Brain" of the user's box. Manages ownership, persistence, and synchronization.
 * 
 * Core Systems:
 * 1. **Persistence:** Auto-saves to LocalStorage and syncs with Server via `useBoxApi`.
 * 2. **View Mode:** Can switch state to display another user's box (`viewingOther`).
 * 3. **Business Logic:** Calculates owned counts based on dynamic filters. 
 * @param {*} param0 
 * @returns 
 */
export function CollectionProvider({children}){
    //1. Persistence  Hook
    const{
        myKeys, setMyKeys,
        ownedItems, setOwnedItems,
        favorites, setFavorites
    } = useBoxPersistence();

    //2. Api Hook
    const{
        restoreBox, updateBox, createBox: apiCreateBox, getOtherBox, isLoadingOther
    } = useBoxApi();


    //3. UI States
    const [viewingOther, setViewingOther] = useState(false);
    const [otherBoxData, setOtherBoxData] = useState(null);
    const [isRestored, setIsRestored] = useState(false);

    const updateTimeoutRef = useRef(null);

    //--- ORCHESTRATION: Sync Logic ---

    //Initial Sync on Load
    useEffect(()=> {
        if(myKeys?.secretKey && !viewingOther){
            const syncData = async()=> {
                const result = await restoreBox(myKeys.secretKey);
                if(result.success){
                    setOwnedItems(result.boxData);
                    setFavorites(result.favorites);

                    if(!myKeys.publicKey && result.publicKey){
                        setMyKeys({...myKeys, publicKey: result.publicKey});
                    }
                }
                setIsRestored(true);
            };
            syncData();
        } else {
            setIsRestored(true);
        }
    }, [myKeys, viewingOther, restoreBox, setOwnedItems, setFavorites, setMyKeys]);

    //Auto-Save Logic
    useEffect(()=> {
        if(myKeys && !viewingOther){
            if(updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
            if(!isRestored) return;

            updateTimeoutRef.current = setTimeout(()=>{
                updateBox(myKeys.secretKey, ownedItems, favorites);
            }, 2000);
        }
    }, [ownedItems, favorites, myKeys, viewingOther, isRestored, updateBox]);

    //---ACTIONS----

    const saveToServer = useCallback(async (boxData, favData, keys) => {
        await updateBox(keys.secretKey, boxData, favData);
    }, [updateBox]);

    const createBox = useCallback(async (initialBoxData) => {
        const result = await apiCreateBox(initialBoxData, favorites);
        if(result.success){
            setMyKeys(result.keys);
            setOwnedItems(initialBoxData);
            setIsRestored(true);
            return result.keys;
        }
        return null;
    }, [favorites, apiCreateBox, setMyKeys, setOwnedItems]);

    const loginWithSecret = useCallback(async (secretKey) => {
        const result = await restoreBox(secretKey);
        if(result.success){
            const newKeys = {publicKey: result.publicKey, secretKey: secretKey};
            setMyKeys(newKeys);
            setOwnedItems(result.boxData);
            setFavorites(result.favorites);
            setViewingOther(false);
            setIsRestored(true);
            return true;
        }
        return false;
    }, [restoreBox, setMyKeys, setOwnedItems, setFavorites]);

    const fetchOtherBox = useCallback(async (publicKey) => {
        const result = await getOtherBox(publicKey);
        if(result.success){
            setOtherBoxData(result.boxData);
            setViewingOther(true);
            return true;
        }
        return false;
    }, [getOtherBox]);

    const exitOtherView = useCallback(()=> {
        setViewingOther(false);
        setOtherBoxData(null);
    }, []);

    const importCollection = useCallback((newCollectionData) => {
        if(viewingOther) return;
        setOwnedItems(newCollectionData);
    }, [viewingOther, setOwnedItems]);

    //---BUSINESS LOGIC----

    const visibleItems = useMemo(()=> {
        return viewingOther ? (otherBoxData || {}): ownedItems;
    }, [viewingOther, otherBoxData, ownedItems]);

    const toggleFavorite = useCallback((crewId) => {
        setFavorites(prev => {

            const currentFavs = Array.isArray(prev) ? prev : [];
            const newFavs = currentFavs.includes(crewId)
            ? currentFavs.filter(id=> id !== crewId)
            : [...currentFavs, crewId];
        return newFavs;
        });
    }, [setFavorites]);

    const isFavorite = useCallback((crewId)=> {
        return Array.isArray(favorites) && favorites.includes(crewId);
    }, [favorites]);

    const toggleChar = useCallback((id, type)=> {
        if(!id) return;

        if(viewingOther) return;

        const numericId = Number(id);
        const cleanType = normalizeType(type);

        setOwnedItems(prev => {
            const next = {...prev};
            if(next['-1']) delete next['-1'];

            if(next[numericId]){
                delete next[numericId];
            } else {
                next[numericId] = cleanType;
            }

            return next;
        });
    }, [viewingOther, setOwnedItems]);


    const isOwned = useCallback((id)=>{
        if(!id) return true;
        if(Number(id) === -1) return false;
        return !!visibleItems[Number(id)];
    }, [visibleItems])

    /**
     * CALCULATE OWNED COUNT
     * --------------------
     * Counts how many items the user owns within a specific filter category
     * 
     * Logic:
     * 1. Filters out placeholder/invalid items (key '-1').
     * 2. Checks if we need 'All' or a specific subset (Legends/RRs)
     * 3. Matches the item's `type` against the `constants.js` arrays.
     * 
     * @param {string} uiCategory - 'legends', 'rareRecruits', or 'all'.
     * @param {string} subCategory - Specific filter (e.g. 'Super Sugo').
     * @param {boolean} isPlus - If true, targets 6+ or 5+ evolutions only.
     */
    const getOwnedCountByCategory = useCallback((uiCategory, subCategory, isPlus) => {
        if(!uiCategory) return 0;

        const realItems = Object.entries(visibleItems).filter(([key, val]) => key !== '-1');

        if(uiCategory === 'all'){
            return realItems.length;
        }

        let targetTypes = [];
        if(isPlus){
            if (uiCategory === 'legends'){
                targetTypes = ['6+ Legend'];
            } else{
                targetTypes = ['5+ Rare Recruit'];
            }
        } else if (uiCategory === 'legends'){
            if (!subCategory || subCategory === 'All Legends' || subCategory === 'null'){
                targetTypes = ALL_LEGEND_TYPES_DB;
            } else {
                targetTypes = [subCategory];
            }
        } else if (uiCategory === 'rareRecruits'){
            if(!subCategory || subCategory === 'All Rare Recruits' || subCategory === 'null'){
                targetTypes = ALL_RR_TYPES_DB;
            } else{
                const dbType = RR_MAPPING_DB[subCategory] || subCategory;
                targetTypes = [dbType];
            }
        }
        const realValues = realItems.map(([key,value])=> value);
        return realValues.filter(storedType => { return targetTypes.includes(storedType);}).length;
    }, [visibleItems]);



    const contextValue = useMemo(()=> ({
        ownedItems: visibleItems,
        myKeys,
        createBox,
        viewingOther,
        toggleChar,
        isOwned,
        getOwnedCountByCategory,
        loginWithSecret,
        fetchOtherBox,
        exitOtherView,
        isLoadingOther,
        importCollection,
        favorites,
        toggleFavorite,
        isFavorite,
        saveToServer
    }), [visibleItems, myKeys, createBox, viewingOther, toggleChar, isOwned, getOwnedCountByCategory, loginWithSecret, fetchOtherBox, exitOtherView, isLoadingOther, importCollection, favorites, toggleFavorite, isFavorite, saveToServer]);

    return (
        <CollectionContext.Provider value = {contextValue}>
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollection = () => useContext(CollectionContext);

export const useFavorites = () => {
    const context = useContext(CollectionContext);
    if(!context){
        throw new Error("useFavorites must be used within a CollectionProvider");
    }
    return { 
        favorites: context.favorites,
        toggleFavorite: context.toggleFavorite, 
        isFavorite: context.isFavorite
    };
};