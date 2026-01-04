import React from 'react';
import BaseModal from '../../../components/modals/BaseModal';
import { useStageGuide } from '../../hooks/useStageGuide';
import GimmickRow from './GimmickRow';
import './StageGuideModal.css';

/**
 * STAGE GUIDE DISPLAY
 * -------------------
 * Renders the official breakdown of the stage (Gimmicks per Battle)
 * Uses 'useStageGuide' to normalize the data before rendering.
 */

function StageGuideModal({isOpen, onClose, guideData, loading}) {
    //1. Parsing Logic
    const { battles, conditions, hasContent} = useStageGuide(guideData);

    if(!isOpen) return null;
    
    return(
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Stage Guide"
            size="large"
            className="stage-guide-modal"
        >
            <div className="modal-body-content">
                {/* State: Loading */}
                {loading && <p className="loading-text">Loading guide...</p>}

                {/* StateL Empty */}
                {!loading && !hasContent && <p className="error-text">No guide available for this stage yet</p>}
                    
                {/*State: Global Conditions */}
                {!loading && conditions.length > 0 && (
                    <div className="stage-conditions">
                            <div className="conditions-header">
                                <span className="info-icon">i</span> Stage Conditions
                            </div>
                            <ul className="conditions-list">
                                {conditions.map((cond, idx) => (
                                    <li key={idx} className="condition-item">
                                        {cond}
                                    </li>
                                ))}
                            </ul>
                        </div>
                )}

                {/*Section: Battle by Battle Gimmicks */}
                {!loading && battles && battles.map((battle, index) => (
                        <div key={index} className="battle-section">
                            <div className="battle-title"> Battle {battle.battle}</div>
                            <div className="gimmick-list">
                                {battle.rows && battle.rows.map((row,rIndex) => (
                                    <GimmickRow key ={rIndex} row={row} />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </BaseModal>
);
}

export default StageGuideModal;