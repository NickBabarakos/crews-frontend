import { useMemo } from "react";
import { useCollection } from "../../context/CollectionContext";

/**
 * SMART SORTING LOGIC
 * -------------------
 * Sorts the crew list based on the user's ownership status.
 * 
 * Algorithm:
 * 1. Iterates through each crew memeber.
 * 2. Assigns points if the user OWNS the unit (skips Friend Captain/Optional units)
 * 3. Sorts crews with higher "Ownership Score" to the top.
 */

export const useCrewsSorting = (crews, sortBy) => {
    const {isOwned} = useCollection();

    const sortedCrews = useMemo(()=> {
            if(!crews) return [];
            if (sortBy === 'default') return crews;
    
            const getCrewScore = (crew) => {
                if(!crew.members) return 0;
                return crew.members.reduce((acc, member) => {
                    if(member.position === 'Friend Captain') return acc;
                    if(member.notes && member.notes.toLowerCase().includes('optional')) return acc;
                    if(member.character_id && isOwned(member.character_id)){
                        return acc+1;
                    }
                    return acc;
                }, 0);
            };
    
            return [...crews].sort((a,b) => getCrewScore(b)-getCrewScore(a));
        }, [crews, sortBy, isOwned])

        return sortedCrews;
};