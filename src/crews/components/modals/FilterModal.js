import React from 'react';
import './FilterModal.css';
import BaseModal from '../../../components/modals/BaseModal';

/**
 * MOBILE FILTER CONTAINER
 * ----------------------
 * A simplified wrapper around BaseModal used specifically for Mobile Views.
 * Allows users to see all Dropdowns in a vertical stack when screem space is limited.
 */

function FilterModal({isOpen, onClose, title, children}){

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title || 'Filters'}
            size="small"
            footer={
                <button
                    className="base-btn base-btn-primary filter-done-btn"
                    onClick={onClose}
                >Done</button>
            }
        >
            <div className="filter-modal-body">
                {children}
            </div>
        </BaseModal>
    );
}

export default FilterModal;