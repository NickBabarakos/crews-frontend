import React, {useState} from 'react';
import './SubmitCrewModal.css';
import { getImageUrl } from '../../../utils/imageUtils';

const LEVELS = ['No', '105', '110', '120', '130', '150'];

export default function CharacterDetailsView({character, isSupport, onConfirm, onBack}){
    const [level, setLevel] = useState('No');
    const [supportType, setSupportType] = useState('mandatory');

    const handleSave = () => {
        if(isSupport){
            onConfirm({supportType});
        } else {
            onConfirm({level});
        }
    };

    return(
        <div className="details-container">
            <h3>Configure {isSupport ? 'Support' : 'Character' }</h3>

            <div className="selected-preview">
                <img src={getImageUrl(`${character.image_url}.png`)} alt={character.name} />
                <p>{character.name}</p>
            </div>

            <div className="options-wrapper">
                {isSupport ? (
                    <div className="option-group">
                        <label>Support Priority:</label>
                        <div className="pill-selector">
                            <button
                                className={`pill-btn ${supportType === 'mandatory' ? 'active mandatory' : ''}`}
                                onClick={()=> setSupportType('mandatory')}
                            >Mandatory</button>

                            <button
                                className={`pill-btn ${supportType === 'optional' ? 'active optional' : ''}`}
                                onClick={()=> setSupportType('optional')}
                            >Optional(!)</button>
                        </div>
                        <p className="option-desc">
                            {supportType === 'mandatory'
                                ? "Required for the strategy to work"
                                : "Just for stats, can be replaced"
                            }
                        </p>
                    </div>
                ):(
                    <div className="option-group">
                        <label>Level/LLB:</label>  
                        <div className="grid-selector">
                            {LEVELS.map(lv => (
                                <button 
                                    key={lv}
                                    className={`grid-btn ${level === lv ? 'active' : ''}`}
                                    onClick={()=> setLevel(lv)}
                                >{lv === 'No' ? 'No' : `Lv.${lv}`}</button>
                            ))} 
                        </div>
                    </div> 
                )}
            </div>

            <div className="details-actions">
                <button className="back-btn" onClick={onBack}>Back</button>
                <button className="confirm-btn" onClick={handleSave}>Confirm</button>
            </div>
        </div>
    );
}