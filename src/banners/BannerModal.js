import React, {useState, useEffect} from 'react';
import BaseModal from '../components/modals/BaseModal';
import './BannerModal.css';
import BannerCharacters from './BannerCharacters';
import BannerSteps from './BannerSteps';

function BannerModal({isOpen, onClose, data, loading}){ 
    const [bannerContent, setBannerContent] = useState('characters');


    const handleContent= ()=>{
        if(bannerContent === 'characters') {
            setBannerContent('steps');
        } else{
            setBannerContent('characters');
        }
    }


    const modalTitle = (
        <div className="banner-modal-title-group">
            <span className="banner-modal-heading">Banner Details</span>
            {data && data.exclusive_chance && (
                <div className="chance-badge">
                    <span className="chance-label">Exclusive Chance</span>
                    <span className="chance-number">{data.exclusive_chance}</span>
                </div> 
            )}
            <button 
                className={`modal-button ${bannerContent === 'steps' ? 'character' : ''}`}
                onClick={handleContent}
            >{bannerContent === 'characters' ? 'Steps' : 'Characters'}</button>
        </div>
    );

    return(
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="large"
            className="banner-modal-wrapper"
        >
            <div className="banner-content">
                {loading ?(
                    <div className="banner-loading-state">Loading Data...</div>
                ): data && bannerContent === "characters" ? (
                    <BannerCharacters data={data} />
                ):data && bannerContent === "steps" ?(
                    <BannerSteps data={data}/>
                ) : (
                    <div className="banner-empty-state">No Data Available </div>
                )}    
            </div>   
        </BaseModal>
    );
}
export default BannerModal;

 