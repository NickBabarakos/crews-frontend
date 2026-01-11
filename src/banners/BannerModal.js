import React from 'react';
import {useCollection} from '../context/CollectionContext';
import BaseModal from '../components/modals/BaseModal';
import InteractiveChar from '../components/common/InteractiveChar';
import { getImageUrl } from '../utils/imageUtils';
import '../characters/CharactersView.css';
import './BannerModal.css';

function BannerModal({isOpen, onClose, data, loading}){
    const {isOwned} = useCollection();

    const modalTitle = (
        <div className="banner-modal-title-group">
            <span className="banner-modal-heading">Banner Details</span>
            {data && data.exclusive_chance && (
                <div className="chance-badge">
                    <span className="chance-label">Exclusive Chance</span>
                    <span className="chance-number">{data.exclusive_chance}</span>
                </div> 
            )}
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
                ): data ? (
                    <div className="banner-categories-list">
                        {data.categories && data.categories.map((cat, idx) => (
                            <div key={idx} className="category-section">
                                <div className="category-header">
                                    <h4>{cat.name}</h4>
                                    {cat.chance && <span className="cat-chance">{cat.chance}</span>}
                                </div>
                                <div className="category-grid">
                                    {cat.characters && cat.characters.map(char=> (
                                        <InteractiveChar
                                            key={char.id}
                                            id={char.id}
                                            type={char.type}
                                            url={char.info_url}
                                            className={`character-card small ${isOwned(char.id) ? '' : 'missing'}`}
                                            title={char.name}
                                        >
                                            <img src={getImageUrl(`${char.image_url}.png`)} alt={char.name} loading="lazy"/>
                                        </InteractiveChar>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <div className="banner-empty-state">No Data Available </div>
                )}    
            </div>   
        </BaseModal>
    );
}
export default BannerModal;

 