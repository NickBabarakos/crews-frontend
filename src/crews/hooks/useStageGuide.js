import {useMemo} from 'react';

/**
 * DATA PARSER: Stage Guide
 * ------------------------
 * Takes raw guide data (which might be a JSON string or an Object)
 * and standardizes it for teh UI.
 * 
 * Responsibilities:
 * 1. Safe JSON Parsing (try/catch)
 * 2. Structure Extraction (Battles vs Conditions)
 * 3. Content Check (hasContent flag)
 */

export const useStageGuide = (guideData) =>{
    return useMemo(()=> {
        let processedData = guideData;

        // DB might return stringified JSON, parse it safely
        if(typeof processedData === 'string'){
            try{
                processedData = JSON.parse(processedData);
            } catch(e) {
                console.error("Error parsing guideData JSON:", e);
                processedData = null;
            }
        }

        const battles = processedData?.battles || [];
        const conditions = processedData?.conditions || [];
        const hasContent = battles.length > 0 || conditions.length > 0;

        return{
            battles,
            conditions,
            hasContent
        };
        //... Return processed object
    }, [guideData]);
};