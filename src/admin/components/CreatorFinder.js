import React from 'react';

function CreatorFinder({status, onUpdate, onCheck, onCreate, onCancel}) {
    return(
         <div className="form-group">
            <label>Crew Creator</label>

            {/*STEP 1: SEARCH */}
            {status.step === 'search' && (
                <div className="search-row">
                    <div className="pill-selector mr-10">
                        <button 
                            className={`pill-button ${status.inputType === 'url' ? 'active' : ''}`}
                            onClick={()=> onUpdate({inputType: 'url'})}
                        >URL</button>
                        <button 
                            className={`pill-button ${status.inputType === 'key' ? 'active' : ''}`}
                            onClick={()=> onUpdate({inputType: 'key'})}
                        >KEY</button>
                    </div>

                    <input 
                        type="text"
                        value={status.urlInput}
                        onChange={(e)=> onUpdate({urlInput: e.target.value})}
                        placeholder={status.inputType === 'key' ? "Enter Box Public Key" : "Channel URL"}
                    />
                    <button 
                        className="submit-btn search-btn"
                        onClick={onCheck}
                    >Check</button>
                </div>
            )}

            {/*STEP 2: NOT FOUND -> CREARE */}
            {status.step === 'not_found' && (
                <div className="creator-box not-found">
                    <p className="warning-text">Creator not found in Database</p>

                    <div className="form-group">
                        <label>{status.inputType === 'key' ? 'Public Key' : 'Channel URL'} (Read Only)</label>
                        <input type="text" value={status.urlInput} disabled />
                    </div>

                    <div className="form-group">
                        <label>Enter Creator Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. Toadskii"
                            value={status.tempName}
                            onChange={(e)=> onUpdate({tempName: e.target.value})}
                        />
                    </div> 

                    <div className="bottom-row">
                        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                        <button className="submit-btn" onClick={onCreate}>Create Creator</button>
                    </div> 
                </div>
            )}

            {/*STEP 3: VERIFIED */}
            {status.step === 'verified' && status.data && (
                <div className="creator-box verified">
                    <p className="success-text">Creator Selected</p>
                    <div className="verified-info">
                        <span><strong>ID:</strong> {status.data.id}</span>
                        <span><strong>Name:</strong>{status.data.name}</span>
                    </div>
                    <small>{status.data.social_url}</small>

                    <button className="cancel-btn" onClick={onCancel}>
                        Change Creator
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreatorFinder;