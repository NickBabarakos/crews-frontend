import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

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
            return saved ? JSON.parse(saved):{};
        } catch (e) {
            console.error("Error loading collection", e);
            return {};
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
            if(next[numericId]){
                delete next[numericId];
            } else {
                next[numericId] = cleanType;
            }
            return next; 
        });
    }, []);

    const isOwned = useCallback((id)=>{
        if(!id) return true;
        return !!ownedItems[Number(id)];
    }, [ownedItems])

    const getOwnedCountByCategory = useCallback((uiCategory, subCategory, isPlus) => {
        if(!uiCategory) return 0;

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
        
        return Object.values(ownedItems).filter(storedType => { return targetTypes.includes(storedType);}).length;
    }, [ownedItems]);

    return (
        <CollectionContext.Provider value = {{ownedItems, toggleChar, isOwned, getOwnedCountByCategory}}>
            {children}
        </CollectionContext.Provider>
    );
}

export const useCollection = () => useContext(CollectionContext);