import React from 'react';
import '../home/HomePage.css';

//Hooks
import { useHomeData } from '../home/hooks/useHomeData';
import { useHomeModals } from '../home/hooks/useHomeModals';

//Components
import HeroSection from '../home/components/HeroSection';
import EventsWidget from '../home/components/dashboard/EventsWidget'
import NewArrivalsWidget from '../home/components/dashboard/NewArrivalsWidget';
import ChangelogWidget from '../home/components/dashboard/ChangelogWidget';

//Features/Modals
import DataTransferModal from '../components/modals/DataTransferModal';
import TeamBuilderModal from '../home/TeamBuilderModal';



function HomePage() {
    //1. Data Layer (Hooks)
    const {stats, events, latestUnits, changelog, isLoading} = useHomeData();
    const modals = useHomeModals();

    //2. Loading State
    if(isLoading) return <div className="home-loader">Loading HQ Data...</div>

    //3. Render
    return(
        <div className="home-container">
           
           {/*Hero Area */}
           <HeroSection
                activeCrewCount={stats.totalCrews}
                onBuildClick={modals.openBuilder}
                onSyncClick={modals.openTransfer}
            />

            {/*---DASHBOARDS---*/}
            <div className="dashboard-grid">
                <EventsWidget events={events}/>
                <NewArrivalsWidget units={latestUnits}/>
                <ChangelogWidget logs={changelog} />
            </div>

            {/*---TOP LEVEL MODALS */}
            <TeamBuilderModal
                isOpen={modals.isOpenBuilder}
                onClose={modals.closeModal}
            />

            <DataTransferModal
                isOpen={modals.isOpenTransfer}
                onClose={modals.closeModal}
            />
    </div>
            
    );
}

export default HomePage;
