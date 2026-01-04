/**
 * SKELETON LOADER
 * ---------------
 * A visual placeholder representing a Crew Card structure.
 * Used during data fetching to prevent layout shitf (CLS) and indicate loading.
 */

function PlaceholderCard() {
    return(
        <div className="crew-card placeholder">

            <h4>&nbsp;</h4>

            <div className="crew-members-grid">
                
                <div className="member-slot placeholder-slot"></div>

                <div className="member-slot placeholder-slot">
                    <div className="support-slot-placeholder"></div>
                </div>
                <div className="member-slot placeholder-slot">
                     <div className="support-slot-placeholder"></div>
                </div>
                <div className="member-slot placeholder-slot">
                     <div className="support-slot-placeholder"></div>
                </div>
                <div className="member-slot placeholder-slot">
                     <div className="support-slot-placeholder"></div>
                </div>
                <div className="member-slot placeholder-slot">
                     <div className="support-slot-placeholder"></div>
                </div>
            
        </div>
    </div>
        
    );
}
export default PlaceholderCard;