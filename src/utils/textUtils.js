 export const getCleanValue = (val, mode) => {
        if(!val) return val;
        if(mode === 'pirate_king_adventures' || mode === 'treasure_map'){
            return val 
                .replace(/\s*\(Hex\)/,'')
                .replace(/\s*\(Boss\)/,'')
                .replace(/\s*\(Intrusion\)/,'')
                .trim();
        }
        return val;
};