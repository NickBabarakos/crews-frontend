import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';

const CollectionContext = createContext();
const BASE_URL = process.env.REACT_APP_BASE_URL;

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

export function CollectionProvider({children}){
    const [myKeys, setMyKeys] = useState(()=> {
        try{
            const saved = localStorage.getItem('optc-box-keys');
            return saved? JSON.parse(saved): null;
        } catch(e) { return null; }
    });


    const [ownedItems, setOwnedItems] = useState(()=> {
       try{
        const saved = localStorage.getItem('optc-collection');
        if(saved) {return JSON.parse(saved);}
        return{'-1': 'SYSTEM_INIT'};
       } catch(e){
        return {'-1': 'SYSTEM_INIT'}
       }
    });

    const [favorites, setFavorites] = useState(()=> {
        try{
            const stored = localStorage.getItem('optc-favorite-crews');
            return stored ? JSON.parse(stored) : [];
        } catch(error) {return []; }
    });
    
   
    const [viewingOther, setViewingOther] = useState(false);
    const [otherBoxData, setOtherBoxData] = useState(null);
    const [isLoadingOther, setIsLoadingOther] = useState(false);
    const [isRestored, setIsRestored] = useState(false);

    const updateTimeoutRef = useRef(null);

    useEffect(()=> {
        if(myKeys?.secretKey && !viewingOther){
            const syncData = async()=> {
                try{
                    const res = await axios.post(`${BASE_URL}/api/box/restore`, {secretKey: myKeys.secretKey});
                    if(res.data.success){
                        setOwnedItems(res.data.boxData);
                        setFavorites(res.data.favorites || []);
                        localStorage.setItem('optc-collection', JSON.stringify(res.data.boxData));

                        if(!myKeys.publicKey && res.data.publicKey){
                            const updatedKeys = {...myKeys, publicKey: res.data.publicKey};
                            setMyKeys(updatedKeys);
                            localStorage.setItem('optc-box-keys', JSON.stringify(updatedKeys));
                        }
                    }
                } catch(err){
                    console.error("Sync failed (offline or invalid key):", err);
                } finally{
                    setIsRestored(true);
                }
            };
            syncData();
        } else {
            setIsRestored(true);
        }
    }, []);

    const saveToServer = useCallback(async (boxData, favData, keys) => {
        if(!keys?.secretKey) return;
        try{
            await axios.post(`${BASE_URL}/api/box/update`, {
                secretKey: keys.secretKey,
                boxData: boxData,
                favorites: favData
            });
            console.log("Cloud save success");
        } catch (err){
            console.error("Cloud save failed.", err);
        }
    }, []);

    const createBox = useCallback(async (initialBoxData) => {
        try{
            const res = await axios.post(`${BASE_URL}/api/box/create`, {
                initialData: initialBoxData,
                favorites: favorites
            });
            if(res.data.success){
                const newKeys = {publicKey: res.data.publicKey, secretKey: res.data.secretKey};
                setMyKeys(newKeys);
                setOwnedItems(initialBoxData);
                localStorage.setItem('optc-box-keys', JSON.stringify(newKeys));
                localStorage.setItem('optc-box-collection', JSON.stringify(initialBoxData));
                setIsRestored(true);
                return newKeys;
            }
        } catch(err){
            console.error("Create box failed:", err);
            return null;
        }
    }, [favorites]);

    const loginWithSecret = useCallback(async (secretKey) => {
        try{
            const res = await axios.post(`${BASE_URL}/api/box/restore`, {secretKey});
            if(res.data.success){
                const newKeys = {publicKey: res.data.publicKey, secretKey: secretKey};
                setMyKeys(newKeys);

                setOwnedItems(res.data.boxData);
                setFavorites(res.data.favorites || []);

                setViewingOther(false);
                setIsRestored(true);

                localStorage.setItem('optc-box-keys', JSON.stringify(newKeys));
                localStorage.setItem('optc-collection', JSON.stringify(res.data.boxData));
                localStorage.setItem('optc-favorite-crews', JSON.stringify(res.data.favorites));
                return true;
            }
        } catch(err){
            return false;
        }
    }, []);

    const fetchOtherBox = useCallback(async (publicKey) => {
        setIsLoadingOther(true);
        try{
            const res = await axios.get(`${BASE_URL}/api/box/view/${publicKey}`);
            setOtherBoxData(res.data.boxData);
            setViewingOther(true);
            return true;
        } catch (err){
            console.error("View box failed", err);
            return false;
        } finally {
            setIsLoadingOther(false);
        }
    }, []);

    const exitOtherView = useCallback(()=> {
        setViewingOther(false);
        setOtherBoxData(null);
    }, []);

    const visibleItems = useMemo(()=> {
        return viewingOther ? (otherBoxData || {}): ownedItems;
    }, [viewingOther, otherBoxData, ownedItems]);

    useEffect(()=> {
        localStorage.setItem('optc-collection', JSON.stringify(ownedItems));
        localStorage.setItem('optc-favorite-crews', JSON.stringify(favorites));

        if(myKeys && !viewingOther){
            if(updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
            if (!isRestored) return;
            updateTimeoutRef.current = setTimeout(()=>{
                saveToServer(ownedItems, favorites, myKeys);
            }, 2000);
        }
    }, [ownedItems, favorites, myKeys, viewingOther, saveToServer, isRestored]);

    const toggleFavorite = useCallback((crewId) => {
        setFavorites(prev => {

            const currentFavs = Array.isArray(prev) ? prev : [];
            const newFavs = currentFavs.includes(crewId)
            ? currentFavs.filter(id=> id !== crewId)
            : [...currentFavs, crewId];
        return newFavs;
        });
    }, []);

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
    }, [viewingOther]);


    const isOwned = useCallback((id)=>{
        if(!id) return true;
        if(Number(id) === -1) return false;
        return !!visibleItems[Number(id)];
    }, [visibleItems])

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
            if (subCategory === 'All Legends'){
                targetTypes = ALL_LEGEND_TYPES_DB;
            } else {
                targetTypes = [subCategory];
            }
        } else if (uiCategory === 'rareRecruits'){
            if(subCategory === 'All Rare Recruits'){
                targetTypes = ALL_RR_TYPES_DB;
            } else{
                const dbType = RR_MAPPING_DB[subCategory] || subCategory;
                targetTypes = [dbType];
            }
        }
        const realValues = realItems.map(([key,value])=> value);
        return realValues.filter(storedType => { return targetTypes.includes(storedType);}).length;
    }, [visibleItems]);

    const importCollection = useCallback((newCollectionData) => {
        if(viewingOther) return;
        setOwnedItems(newCollectionData);
    }, [viewingOther]);

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
        isFavorite
    }), [visibleItems, myKeys, createBox, viewingOther, toggleChar, isOwned, getOwnedCountByCategory, loginWithSecret, fetchOtherBox, exitOtherView, isLoadingOther, importCollection, favorites, toggleFavorite, isFavorite]);

    return (
        <CollectionContext.Provider value = {contextValue}>
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollection = () => useContext(CollectionContext);

export const useFavorites = () => {
    const {favorites, toggleFavorite, isFavorite} = useContext(CollectionContext);
    return { favorites, toggleFavorite, isFavorite};
};