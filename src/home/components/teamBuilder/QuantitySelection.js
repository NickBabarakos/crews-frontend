import React from "react";

const QuantitySelection = ({onSelect}) => {
    return(
        <div className="step-container center-content">
            <h3 style={{color: 'var(--text-main)', marginBottom: '10px'}}>How many teams do you want to build? </h3>
                <p className="hint-text" style={{marginBottom: '30px', textAlign: 'center'}}>
                    You can build and export up to 4 teams in a single image.
                </p>

                <div className="quantity-grid">
                    {[1,2,3,4].map(num => (
                        <button
                            key={num}
                            className="quantity-btn"
                            onClick={()=>onSelect(num)}
                        >
                            <span className="qty-num">{num}</span>
                            <span className="qty-label">{num === 1 ? 'Team' : 'Teams'}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
};

export default QuantitySelection;