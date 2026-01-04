import React from 'react';
import '../SubmitCrewModal.css';

/**
 * STEP 3: CREATOR VERIFICATION
 * ----------------------------
 * Handles the User Identity logic before submission.
 * 
 * Flows:
 * 1. Social Handle: User enters URL -> API Checks -> Identity Confirmed.
 * 2. Box Key: User enters Public Key -> API Chekcs -> Identity Confirmed.
 * 3. New User: If not found, allows entering a custom "Manual Name".
 */

function VerificationStep({
    crewTitle,
    setCrewTitle,
    guideType,
    inputType,
    setInputType,
    setVerificationStep,
    verificationStep,
    creatorIdentity,
    socialInput,
    setSocialInput,
    keyInput,
    setKeyInput,
    manualName,
    setManualName,
    onVerifyHandle,
    onVerifyKey,
    onAutoFillKey
}) {
    return(
        <div className="step-container">
            <div className="form-grid verification-mode">
                <div className="input-group full-width">
                    <label>Crew Name <span style={{color: 'var(--color-danger)'}}>*</span></label>
                        <input 
                            type="text"
                            className="modal-input glass-input"
                            placeholder="eg. Local Sea Monster (F2P)"
                            value={crewTitle}
                            onChange={(e)=> setCrewTitle(e.target.value)}
                        />
                </div>

            <div className="section-divider full-width">
                <span>Creator Verification</span>
            </div>

            <div className="verification-tabs full-width">
                <button 
                    className={`tab-btn ${inputType === 'handle' ? 'active' : ''}`}
                    onClick={()=> {setInputType('handle'); setVerificationStep('idle'); }}
                >Link Social Handle</button>

                {guideType === 'text' && (
                    <button 
                        className={`tab-btn ${inputType === 'key' ? 'active' : ''}`}
                        onClick={()=> {setInputType('key'); setVerificationStep('idle');}}
                    >Use Box Public Key</button>
                )}
            </div>

            <div className="verification-input-area full-width">
                {verificationStep === 'confirmed' ? (
                    <div className="verified-badge">
                        <div className="badge-content">
                            <span className="check-icon">✓</span>
                                <div className="badge-info">
                                    <span className="label">verified Creator</span>
                                        <span className="name">{creatorIdentity.name}</span>
                                </div>
                            </div>
                        <button className="change-btn" onClick={()=> setVerificationStep('idle')}>Change</button>
                    </div>

                ):(
                    <div className="search-box-wrapper">
                        {inputType === 'handle' ? (
                            <div className="input-group full-width">
                                <label>Social Handle /URL</label>
                                    <input 
                                        type="text"
                                        className="modal-input glass-input"
                                        placeholder="Youtube/Twitter/Discord Url or Handle..."
                                        value={socialInput}
                                        onChange={(e)=> setSocialInput(e.target.value)}
                                    />
                            </div>
                        ):(
                            <div className="input-group full-width">
                                <label>Box Public Key</label>
                                    <div className="key-input-group">
                                        <input 
                                            type="text"
                                            className="modal-input glass-input"
                                            placeholder="Enter Public Key"
                                            value={keyInput}
                                            onChange={(e)=> setKeyInput(e.target.value)}
                                        />
                                        <button className="paste-key-btn" onClick={onAutoFillKey} title="Use My Key">Paste My Key</button>
                                                
                                    </div>
                                </div>
                                                
                            )}

                            <button 
                                className="verify-action-btn"
                                onClick={inputType === 'handle' ? onVerifyHandle : onVerifyKey}
                                disabled={inputType === 'handle' ? !socialInput : !keyInput}
                            >Verify</button>
                        </div>
                    )}
                </div>
                {verificationStep === 'found' && (
                    <div className="verification-result full-width">
                        <p className="verification-prompt">Is this you?</p>

                        <div className="creator-card-mini modern-card">
                            
                            <div className="creator-avatar-placeholder">
                                {creatorIdentity.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="creator-info-block">
                                <span className="creator-name-large">{creatorIdentity.name}</span>
                                <span className="creator-id-display">ID: {creatorIdentity.id}</span>
                            </div>
                        </div>


                        <div className="verification-actions">
                            <button className="confirm-btn-small modern" onClick={()=> setVerificationStep('confirmed')}>Yes, it's me</button>
                            <button className="reject-btn-small modern" onClick={()=>setVerificationStep('idle')}>No</button>
                        </div>
                    </div>
                )}

                {(verificationStep === 'not_found' || verificationStep === 'valid_key_no_creator') && (
                    <div className="manual-name-input full-width fade-in">
                        <div className="alert-box info">
                            {verificationStep === 'not_found'
                                ? "Creator not found. Enter your name to create a new profile."
                                : "Valid Key found! Enter your name to create your Creator Profile"
                            }
                        </div>
                        
                        <label>Your Name <span style={{color: 'var(--color-danger)'}}>*</span></label>
                            <input 
                                type="text"
                                className="modal-input glass-input"
                                placeholder="Enter your nickname..."
                                value={manualName}
                                onChange={(e)=> setManualName(e.target.value)}
                            />
                    </div>
                )}

            </div>
        </div>
    );
}

export default VerificationStep;