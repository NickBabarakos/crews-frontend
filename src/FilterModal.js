import React from 'react';
import './FilterModal.css';

function FilterModal({isOpen, onClose, title, children}){
    if(!isOpen) return null;

    return (
        <div className="filter-modal-backdrop" onClick={onClose}>
            <div className="filter-modal-content" onClick={e=> e.stopPropagation()}>
                <div className="filter-modal-header">
                    <h3>{title || 'Filters'}</h3>
                    <button className="filter-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="filter-modal-body">
                    {children}
                </div>
                <div className="filter-modal-footer">
                    <button className="pill-button active" style={{width: '100%'}} onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>

    );
}
export default FilterModal;