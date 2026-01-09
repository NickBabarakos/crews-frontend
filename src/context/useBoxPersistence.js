import {useState, useEffect, useCallback} from 'react';

const STORAGE_KEYS = {
    KEYS: 'optc-box-keys',
    COLLECTION: 'optc-collection',
    FAVORITES: 'optc-favorite-crews'
};

export const useBoxPersistence = () =>{
    //---1. User Keys (Auth) ---
    const [myKeys, setMyKeys] = useState(()=> {
        try{
            const saved = localStorage.getItem(STORAGE_KEYS.KEYS);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {return null;}
    });

    //---2. Owned Items (Box Data) ---
    const [ownedItems, setOwnedItems] = useState(()=> {
        try{
            const saved = localStorage.getItem(STORAGE_KEYS.COLLECTION);
            if(saved) { return JSON.parse(saved);}
            return {'-1': 'SYSTEM_INIT'};
        } catch(e){
            return {'-1': 'SYSTEM_INIT'};
        }
    });

    //---3 Favorites
    const [favorites, setFavorites] = useState(()=> {
        try{
            const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return stored ? JSON.parse(stored) : [];
        } catch (error) { return [];}
    });

    //---Sync Effects (Save to LS on change) ---
    useEffect(()=> {
        if(myKeys){
             localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(myKeys));
        }
    }, [myKeys]);

    useEffect(()=> {
        localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(ownedItems));
    }, [ownedItems]);

    useEffect(()=> {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }, [favorites]);

    //Helpers to update state
    const updateKeys = useCallback((newKeys) => setMyKeys(newKeys), []);
    const updateCollection = useCallback((data) => setOwnedItems(data), []);
    const updateFavorites = useCallback((data)=> setFavorites(data), []);

    return{
        myKeys,
        ownedItems,
        favorites,
        setMyKeys: updateKeys,
        setOwnedItems: updateCollection,
        setFavorites: updateFavorites
    };
};