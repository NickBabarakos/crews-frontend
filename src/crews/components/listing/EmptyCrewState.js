import React from "react";
import '../views/CrewsView.css';
import { getImageUrl } from "../../../utils/imageUtils";

/**
 * EMPTY STATE COMPONENT
 * ---------------------
 * Renders user feedback when no crews are found
 */
function EmptyCrewState({showOnlyOwned}){
    const content = showOnlyOwned ? {
            image: "other/luffy-rayleigh.png",
            title: "The New World Awaits You!",
            text: "No crews found matching your current Character Box. Keep sailing, recruit powerful allies, and grow stronger. The path to becoming the Pirate King is long, but your adventure is just begining!"
        }:{
            image: "other/crews-not-found.png",
            title: "Uncharted Waters Ahead!",
            text:"It seems you're the first pirate to explore this area. If you've conquered this challenge, help us map the way! Join our Discord server to share your crew and guide your fellow adventurers."
        };
            return(
            <div className = "no-crews-message">
                <div className="empty-state-card">
                    <img src={getImageUrl(content.image)} className="luffy-empty-state-image" alt="Empty State"/>
                    <h2>{content.title}</h2>
                    <p>
                        {content.text}
                    </p>
            </div>
            </div>
        );
        
};

export default EmptyCrewState;