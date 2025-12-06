import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

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

const CollectionContext = createContext();

const normalizeType = (input) => {
    if(!input) return '';

    if(Array.isArray(input)) {
        return String(input[0]).trim();
    }

    return String(input).trim();
};

export function CollectionProvider({children}){
    const [ownedItems, setOwnedItems] = useState(()=> {
        try{
            const saved = localStorage.getItem('optc-collection');
            if(saved) { return JSON.parse(saved);}
            const emptyCollection = { '-1': 'SYSTEM_INIT'};
            localStorage.setItem('optc-collection', JSON.stringify(emptyCollection));
            return emptyCollection;
        } catch (e) {
            console.error("Error loading collection", e);
            return {'-1': 'SYSTEM_INIT'};
        }
    });

    useEffect(()=> {
        localStorage.setItem('optc-collection', JSON.stringify(ownedItems));
    }, [ownedItems]);

    const toggleChar = useCallback((id, type) => {
        if(!id) return;
        const numericId = Number(id);

        const cleanType = normalizeType(type);

        setOwnedItems(prev => {
            const next = {...prev};
            if(next['-1']){
                delete next['-1'];
            }

            if(next[numericId]){
                delete next[numericId];
            } else {
                next[numericId] = cleanType;
            }
            return next; 
        });
    }, []);

    const importCollection = useCallback((newCollection) => {
        try{
            if(typeof newCollection === 'object' && newCollection !== null){
                setOwnedItems(newCollection);
                return { success: true, count: Object.keys(newCollection).length};
            }
            return {success: false, error: 'Invalid data format'};
        } catch(e){
            console.error("Import failed",e);
            return { success: false, error: e.message};
        }
    }, []);

    const isOwned = useCallback((id)=>{
        if(!id) return true;
        if(Number(id) === -1) return false;
        return !!ownedItems[Number(id)];
    }, [ownedItems])

    const getOwnedCountByCategory = useCallback((uiCategory, subCategory, isPlus) => {
        if(!uiCategory) return 0;

        const realItems = Object.entries(ownedItems).filter(([key, val]) => key !== '-1');

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
    }, [ownedItems]);

    const contextValue = useMemo(()=> ({
        ownedItems,
        toggleChar,
        isOwned,
        getOwnedCountByCategory,
        importCollection
    }), [ownedItems, toggleChar, isOwned, getOwnedCountByCategory, importCollection]);

    return (
        <CollectionContext.Provider value = {contextValue}>
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollection = () => useContext(CollectionContext);