import React from "react";
import '../HomePage.css';

const HeroSection = ({activeCrewCount, onBuildClick, onSyncClick}) => {
    return(
         <section className="hero-section">
            <div className="hero-content-wrapper">

                <div className="live-badge">
                    <span className="live-pulse-dot"></span>
                    <span>{activeCrewCount} Crews Sailing Currently</span>
                </div>

                <h1 className="hero-title">
                    The Ultimate Tool for <br/> 
                    <span className="text-gradient">Aspiring Crew Captains</span>
                </h1>
                <p className="hero-subtitle">
                    Enter the High Seas! Find and Share Crews with Other Players.
                </p>

                <div className="hero-actions">
                    <button className="cta-btn primary" onClick={onBuildClick}>
                        Build a Team
                    </button>
                    <button className="cta-btn secondary" onClick={onSyncClick}>
                        Sync Box
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;