/**
 * HOOK: Team Builder State Management
 * -----------------------------------
 * Manages the complex state of teams and navigation (Wizard Logic)
 * 
 * DATA STRUCTURE MAPPING:
 * -----------------------
 * const teams = [
 *  {
 *      id: 0,
 *      title: "Team 1",
 *      data: {
 *          'Captain': { id: 123, level: 150, ...charData},
 *          'Support Captain': { id: 456, ...charData},
 *          'Crewmate1': null,
 *          ...
 *         }
 *       },
 *     ...
 * ]
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {INITIAL_SLOT_STATE} from "../utils/teamBuilderConstants";

export const useTeamBuilder = (isOpen) => {
    //--- State ---
    const [step, setStep] = useState(1);
    const [teamCount, setTeamCount] = useState(1);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
    const [teams, setTeams] = useState([]);

    //--- Selection State ---
    const [editingSlot, setEditingSlot] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);

    //---Reset Logic---
    const resetBuilder = useCallback(()=> {
        setStep(1);
        setTeamCount(1);
        setTeams([]);
        setCurrentTeamIndex(0);
        setEditingSlot(null);
        setSelectedChar(null);
    }, []);

    // Reset when modal closes
    useEffect(()=>{
        if (!isOpen) resetBuilder();
    }, [isOpen, resetBuilder]);

    //---Actions---

    //Step 1: Initialize empty teams
    const initializeTeams = (count) => {
        setTeamCount(count);
        const newTeams = Array(count).fill(null).map((_,index) => ({
            id: index,
            title: `Team ${index+1} Name`,
            data: {...INITIAL_SLOT_STATE}
        }));
        setTeams(newTeams);
        setStep(2);
    };

    //Update Title
    const updatedTeamTitle = (newTitle) => {
        setTeams(prev => {   
            const updated = [...prev];
            updated[currentTeamIndex] = {...updated[currentTeamIndex], title: newTitle}
            return updated;
        });
    };

    //Slot Interaction
    const openSlot = (slotId) => {
        setEditingSlot(slotId);
        setSelectedChar(null);
    };

    
    const selectCharacter = (char) => {
        setSelectedChar(char);
    };

    //Confirm Character Details (Level, Support, etc.)
    /**
     * DATA MERGE STRATEGY:
     * Combines character data (API) with user inputs (Level/Support)
     * Performs an immutable update on the `teams` array at the specific index and slot key.
     */
    const confirmCharacterDetails = (details) => {
        setTeams(prev => {
            const updated = [...prev];
            const currentTeam = updated[currentTeamIndex];
            currentTeam.data ={
                ...currentTeam.data,
                [editingSlot]: {...selectedChar,...details }
            };
            return updated;
        });
        // Reset Selection state
        setSelectedChar(null);
        setEditingSlot(null);
    };

    //Navigation Logic (Next Button)
     const goToNextTeam = () => {
        const currentData = teams[currentTeamIndex].data;
        if(!currentData['Captain']){
            toast.error("Please select at least a Captain for this team");
            return {action: 'STAY'};
        }

        if(currentTeamIndex < teamCount-1){
            setCurrentTeamIndex(prev => prev +1);
            return {action: 'NEXT_TEAM'};
        } else{
            return {action: 'READY_TO_EXPORT'};
        }
    };

    // Navigation Logic (Back Button)
    const goBack = () => {
        if(selectedChar){
            setSelectedChar(null); //Back from details
            return;
        } 
        if (editingSlot) {
            setEditingSlot(null); //Back from selector
            return;
        } 
        if (currentTeamIndex > 0){
            setCurrentTeamIndex(prev=>prev-1); //Previous team
            return;
        } 
    
        setStep(1); //Back to start
    };

    return{
        state:{
            step,
            teamCount,
            teams,
            currentTeamIndex,
            currentTeam: teams[currentTeamIndex],
            editingSlot,
            selectedChar
        }, 
        actions: {
            initializeTeams,
            updatedTeamTitle,
            openSlot,
            selectCharacter,
            confirmCharacterDetails,
            goToNextTeam,
            goBack
        }
    };
};