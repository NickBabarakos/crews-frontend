import React from "react";
import './BannerSteps.css';

const KEYWORDS =[
    'RAINBOW GEMS', 'AURORA GEM', 'AURORA GEMS', 'RAINBOW TAVERN MEDALS',  
    'GUARANTEED DAMAGE LIMIT BREAK: TYPE TABLET','LIMIT BREAK: CLASS TABLET', 'GUIDING KEY: RAINBOW', 
    'SUGO-FEST-EXCLUSIVE', 'SUGO-FEST EXCLUSIVE', 'PIRATE RUMBLE SUGO-FEST ONLY CHARACTER', 'ANNIVERSARY SUGO-FEST EXCLUSIVE CHARACTER', 
    'RATE-BOOSTED CHARACTER','RECOMENDED CHARACTER', 
    'RARE STR LLB POSTER', 'RARE DEX LLB POSTER', 'RARE QCK LLB POSTER', 'RARE PSY LLB POSTER', 'RARE INT LLB POSTER', 'RARE RAINBOW LLB POSTER', 
    'SUGO RARE STR LLB POSTER', 'SUGO RARE DEX LLB POSTER', 'SUGO RARE QCK LLB POSTER', 'SUGO RARE PSY LLB POSTER', 'SUGO RARE INT LLB POSTER', 'SUGO RARE RAINBOW LLB POSTER', 
    'LIMITED POOL', 'SUPER LIMITED POOL', 
    'ALL', 'GET', 
    '30%', '40%', '50%' 
]
const SORTED_KEYWORDS = KEYWORDS.sort((a,b) => b.length - a.length);

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KEYWORD_REGEX = new RegExp(`(${SORTED_KEYWORDS.map(escapeRegExp).join('|')})`, 'gi');

const formatStepText = (text) => {
    if(!text) return null;

    const parts = text.split(KEYWORD_REGEX);

    return parts.map((part, index) => {
        const isKeyword = SORTED_KEYWORDS.find(k => k.toLowerCase()=== part.toLowerCase());

        if(isKeyword){
            const className=`highlight-${part.toLowerCase().replace(/\s+/g, '-').replace(/%/g, 'pct')}`;
            return <span key={index} className={`highlight-text ${className}`}>{part}</span>;
        }
        return part;
    });
};

function BannerSteps({data}){

    if(!data || !data.steps || data.steps.length === 0){
        return(
            <div className="banner-empty-state"> No Step Details Available </div>
        );
    }

    return(
        <ol className="banner-steps-list">
            {data.steps && data.steps.map(step => (
            <li 
                key={step.step_number} 
                className="banner-step-row"
                >
                <div className="step-indicator">
                    <span className="step-label">Step</span>
                    <span className="step-num" >{step.step_number}</span>
                </div>

                {step.text1 && (
                    <div className="step-wrapper">
                        <p className="step-main-title"> 
                            {formatStepText(step.text1)} 
                        </p>

                        <div className="step-pool-row">
                            <span className="pool-label">Pool:</span>
                            {step.legends && <span className="pool-badge pool-legends">Legends: {step.legends}</span>}
                            {step.rare_recruits && <span className="pool-badge pool-rr">Rare Recruits: {step.rare_recruits}</span>}
                        </div>

                        {step.text2 && step.text2 !== "" && (
                            <div className="step-bonus-row">
                                <p className="step-bonus-text">{formatStepText(step.text2)}</p>
                            </div>
                        )}
                    </div>

                    )}
                </li>
        ))}
    </ol>
        

    );

}

export default BannerSteps;