import React from 'react';
import { useContentManager } from './hooks/useContentManager';
import StageGuideModal from '../crews/components/modals/StageGuideModal';

//Forms
import PkaForm from './components/content-forms/PkaForm';
import TmForm from './components/content-forms/TmForm';
import KizunaForm from './components/content-forms/KizunaForm';
import DeleteCrewForm from './components/content-forms/DeleteCrewForm';


function ManageContentView({ adminSecret }){

    const{
        activePill, setActivePill,
        loading,
        previewData,
        isPreviewOpen, setIsPreviewOpen,
        handlePreview,
        handleUpdateEvent,
        handleDeleteCrew
    } = useContentManager(adminSecret);

    return(
        <div className="manage-content-container">
            {/*Pills Navigator*/}
            <div className="pill-selector mb-20">
                {['pka', 'tm', 'kizuna', 'delete'].map(pill => (
                    <button 
                        key={pill}
                        className={`pill-button ${activePill === pill ? 'active' : ''}`}
                        onClick={()=> setActivePill(pill)}
                    >
                        {pill.toUpperCase()}
                    </button>
                ))}
            </div> 

            {/* Form Container */}
            <div className="admin-form">
                {activePill === 'pka' && (
                    <PkaForm
                        onUpdate={handleUpdateEvent}
                        onPreview={handlePreview}
                        loading={loading}
                    />
                )}

                {activePill === 'tm' && (
                    <TmForm
                        onUpdate={handleUpdateEvent}
                        onPreview={handlePreview}
                        loading={loading}
                    />
                )}

                {activePill === 'kizuna' && (
                    <KizunaForm
                        onUpdate={handleUpdateEvent}
                        onPreview={handlePreview}
                        loading={loading}
                    />
                )}

                {activePill === 'delete' && (
                    <DeleteCrewForm
                        onDelete={handleDeleteCrew}
                    />
                )}



            </div>

            <StageGuideModal 
                isOpen={isPreviewOpen}
                onClose={()=> setIsPreviewOpen(false)}
                guideData={previewData}
            />
        </div>
    );
}

export default ManageContentView;