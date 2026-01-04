import { useState, useMemo} from "react";
import { useEventNames } from "../crews/hooks/useEventNames";
import { useCrewsPageModals } from "../crews/hooks/useCrewsPageModals";
import { useCrewsPageData } from "../crews/hooks/useCrewsPageData";
import CrewsView from "../crews/components/views/CrewsView";
import BossGridView from "../crews/components/views/BossGridView";
import Toolbar from "../components/Toolbar";
import Footer from "../components/layout/Footer";
import StageGuideModal from "../crews/components/modals/StageGuideModal";
import TextGuideModal from "../crews/components/modals/TextGuideModal";
import ReportModal from "../crews/components/modals/ReportModal";
import SubmitCrewModal from "../crews/features/SubmitCrew/SubmitCrewModal";
import viewConfig from '../crews/utils/ViewConfig';
import { useCrewFilterManager } from "../crews/hooks/useCrewFilterManager";

/**
 * MAIN PAGE COMPONENT: Crews Listing
 * ----------------------------------
 * Acts as the Orchestrator (View Layer).
 * It creates no logic of its own but composes specialized hooks to render the page.
 */

const CrewsPage = ({mode}) => {
    //1. CONFIGURATION LAYER
    // Loa the speicific settings for this game mode (e.g. Kizuna vs Grand Voyage)
    const config = useMemo(()=> viewConfig[mode] || {}, [mode]); //Φόρτωση ρυθμίσεων για τη συγκεκριμένη σελίδα.
    const eventNames = useEventNames();
    const [pageSize, setPageSize] = useState(4);
    const [showOnlyOwned, setShowOnlyOwned] = useState(false);
    const [sortBy, setSortBy] = useState('default');

    //2. CONTROLLER LAYER (State & URL Management)
    // Handles filters, pagination, and URL sync
    const{
        crewFilters,
        currentPage, setCurrentPage,
        selectedBoss, setSelectedBoss,
        highlightedCrewId,
        isInitializingRef,
        handleFilterChange,
        searchParams,
        clearUrlParams
    } = useCrewFilterManager(mode, config, pageSize, eventNames);

    //3. INTERACTION LAYER (Modals)
    // Manages open/close state of Guide, Report and Submit modals
    const modals = useCrewsPageModals(config, crewFilters, selectedBoss, mode);

    //4. DATA LAYER (Fetching)
    //Fetches the actual content based on the state above.
    const{
        bossesData,
        isBossLoading,
        crewData,
        sortedCrews,
        shouldFetchCrews
    } = useCrewsPageData({
        mode,
        config,
        crewFilters,
        selectedBoss,
        currentPage,
        pageSize,
        showOnlyOwned,
        sortBy,
        isInitializingRef
    });



    //5. RENDER Layer
    return(
        <>
            <Toolbar 
                viewMode={mode}
                config={config}
                crewFilterValues={crewFilters}
                onCrewFiltersChange={handleFilterChange}
                onOpenGuide={modals.handleOpenGuide}
                onToggleOwned ={()=> setShowOnlyOwned(!showOnlyOwned)}
                sortBy={sortBy}
                showOnlyOwned={showOnlyOwned}
                onToggleSort={()=> setSortBy(prev => prev === 'default' ? 'owned' : 'default')}
                showActions={shouldFetchCrews}
                disabled={mode === 'coliseum' && selectedBoss}
                disableAutoSelect={!!searchParams.get('crew')}
                eventNames={eventNames}
            />

            {!isBossLoading && mode === 'coliseum' && !selectedBoss && (
                <BossGridView
                    stages={bossesData?.stages || []}
                    onBossClick={(boss) => {setSelectedBoss(boss); setCurrentPage(1);}}
                    onPageSizeChange={()=>{}}
                />
            )}

            {mode === 'coliseum' && selectedBoss && (
                <div style={{padding: '10px 40px', display: 'flex', alignItems: 'center', gap:'10px'}}>
                    <button 
                        onClick={()=> {setSelectedBoss(null); clearUrlParams();}}
                        className="pill-button active"
                    >Back</button>
                    <h3 style={{margin:0, color: 'var(--text-accent)'}}>{selectedBoss.name}</h3>
                </div>
            )}

            {shouldFetchCrews && (
                <CrewsView 
                    crews={sortedCrews}
                    onPageSizeChange={setPageSize}
                    showOnlyOwned={showOnlyOwned}
                    onAddCrewClick={modals.handleOpenSubmit}
                    onOpenTextGuide={modals.setSelectedTextGuideCrew}
                    onReport={modals.setSelectedReportCrew}
                    sortBy={sortBy}
                    highlightedCrewId={highlightedCrewId}
                />
            )}

            <StageGuideModal
                isOpen={modals.isGuideOpen}
                onClose={modals.closeGuide}
                guideData={modals.guideData}
                loading={modals.guideLoading}
            />

            <TextGuideModal
                isOpen={!!modals.selectedTextGuideCrew}
                onClose={modals.closeTextGuide}
                crewData={modals.selectedTextGuideCrew}
            />

            <ReportModal
                isOpen={!!modals.selectedReportCrew}
                onClose={modals.closeReport}
                crewData={modals.selectedReportCrew}
            />

            <SubmitCrewModal
                isOpen={modals.isSubmitModalOpen}
                onClose={modals.closeSubmit}
                stageName={selectedBoss?.name || crewFilters.stage}
                stageId={modals.submitStageId}
            />

            <Footer 
                currentPage={currentPage}
                hasMore={mode === 'coliseum' && !selectedBoss ? bossesData?.hasMore : crewData?.hasMore}
                onPageChange={(dir)=>{
                    clearUrlParams();
                    const newPage = dir === 'next' ? currentPage + 1 : currentPage -1;
                    if(newPage>0) {setCurrentPage(newPage); window.scrollTo({top:0, behavior:'smooth'});}
                }}
                hasSearched={true}
            />

        </>
    );
};

export default CrewsPage;

