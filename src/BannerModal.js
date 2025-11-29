import React from 'react';
import {useCollection} from './CollectionContext';
import './StageGuideModal.css';
import './CharactersView.css';
import './BannerModal.css';

function BannerModal({isOpen, onClose, data, loading}){
    const {isOwned, toggleChar} = useCollection();

    if(!isOpen) return null;

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content banner-modal glass-effect" onClick={e=> e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-area">
                        <h2>Banner Details</h2>
                        {data && data.exclusive_chance && (
                            <div className="chance-badge">
                                <span className="chance-label">Exclusive Chance</span>
                                <span className="chance-number">{data.exclusive_chance}</span>
                            </div>
                        )}
                    </div>

                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                    </button>
                </div>

                <div className="banner-details-container custom-scrollbar">
                    {loading ? (
                        <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}> Loading Data...</div>
                    ): data ? (
                        <div className="banner-categories-list">
                            {data.categories && data.categories.map((cat, idx) => (
                                <div key={idx} className="category-section">
                                    <div className="category-header">
                                        <h4>{cat.name}</h4>
                                        {cat.chance && <span className="cat-chance">{cat.chance}</span>}
                                    </div>
                                    <div className="category-grid">
                                        {cat.characters && cat.characters.map(char => (
                                            <a 
                                                key={char.id}
                                                href={char.info_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`character-card small ${isOwned(char.id)?  '': 'missing'}`}
                                                onContextMenu={(e)=> {
                                                    e.preventDefault();
                                                    toggleChar(char.id, char.type);
                                                }}
                                                title={char.name}
                                            >
                                             <img src={`${char.image_url}.png`} alt={char.name} loading="lazy" />
                                        </a>
                                        ))}
                                    </div>
                                </div>
                                ))}
                            </div>
                                
                    ): (
                        <div style={{padding:'40px', textAlign:'center'}}> No Data Available </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BannerModal;