import {useState, useCallback} from 'react';
import { getStageInfo } from '../../api/stageService';

/**
 * MODALORCHESTRATOR HOOK
 * ----------------------
 * Centralizes the open/close state logic for all modals on the Crews Page.
 * Also handles data fetching BEFORE opening a modal (e.g. fetching Stage Guide)
 * 
 * @param {object} config - The current view configuration
 * @param {*} crewFilters  - Current active filters (needed to fetch correct stage info)
 * @param {*} selectedBoss - (Coliseum only) The specific boss selected
 */

export const useCrewsPageModals = (config, crewFilters, selectedBoss, mode) => {
    //State declarations...
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [guideData, setGuideData] = useState(null);
    const [guideLoading, setGuideLoading] = useState(false);
    const [selectedTextGuideCrew, setSelectedTextGuideCrew] = useState(null);
    const [selectedReportCrew, setSelectedReportCrew] = useState(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submitStageId, setSubmitStageId] = useState(null);

    /**
     * HANDLER: Open Stage Guide
     * Fetches the guide data from the API based on current filters/mode.
     * Sets 'loading' state while fetching to show a spinner in the modal.
     */
    const handleOpenGuide = useCallback(async () => {
        setIsGuideOpen(true);
        setGuideLoading(true);
        
        // Prepare params: If in Coliseum, use the Selected Boss name instead of generic filters.
        let params = { mode: config.mode, ...crewFilters};
        if(mode === 'coliseum' && selectedBoss) params.stage = selectedBoss.name;

        try{
            const data = await getStageInfo(params);
            setGuideData(data.guide);
        } catch(err){
            console.error(err);
            setGuideData(null);
        } finally{
            setGuideLoading(false);
        }
    }, [config.mode, crewFilters, mode, selectedBoss]);


    /**
     * HANDLER: Open Submit Modal
     * Resolves the correct Stage ID before opening the submission form.
     */
    const handleOpenSubmit = useCallback(async ()=> {
        if (mode === 'coliseum' && selectedBoss){
            setSubmitStageId(selectedBoss.id);
            setIsSubmitModalOpen(true)
        return;
        }
        
        // Case B: Other modes- Fetch Stage ID based on active filters
        let params = {mode: config.mode, ...crewFilters };
        try{
            const data = await getStageInfo(params);
            if(data?.id) { setSubmitStageId(data.id); setIsSubmitModalOpen(true);}
        } catch(e) { console.error(e)}
    },[mode, selectedBoss, config.mode, crewFilters]);

    const closeGuide = useCallback(()=> setIsGuideOpen(false), []);
    const closeTextGuide = useCallback(()=> setSelectedTextGuideCrew(null), []);
    const closeReport = useCallback(()=> setSelectedReportCrew(null), []);
    const closeSubmit = useCallback(()=> setIsSubmitModalOpen(false), []);

    return{
        //States
        isGuideOpen,
        guideData,
        guideLoading,
        selectedTextGuideCrew,
        selectedReportCrew,
        isSubmitModalOpen,
        submitStageId,

        //Handlers (Setters/Actions)
        handleOpenGuide,
        handleOpenSubmit,
        setSelectedTextGuideCrew,
        setSelectedReportCrew,

        //Close Handlers
        closeGuide,
        closeTextGuide,
        closeReport,
        closeSubmit
    };
};