
import React, {useState} from "react";
import DashboardCard from "./DashboardCard";
import BaseModal from "../../../components/modals/BaseModal";

const LogIcon = () => (
     <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M 10 4 C 8.355 4 7 5.355 7 7 L 7 21 L 4 21 L 4 25 C 4 26.645 5.355 28 7 28 L 21 28 L 21.03125 28 C 22.66025 27.984 24 26.633 24 25 L 24 11 L 28 11 L 28 7 C 28 5.355 26.645 4 25 4 L 10 4 z M 10 6 L 22.1875 6 C 22.0745 6.316 22 6.648 22 7 L 22 25 C 22 25.566 21.566 26 21 26 C 20.437 26.008 20.008 25.562 20 25 L 19.96875 21 L 9 21 L 9 7 C 9 6.434 9.434 6 10 6 z M 25 6 C 25.566 6 26 6.434 26 7 L 26 9 L 24 9 L 24 7 C 24 6.434 24.434 6 25 6 z M 6 23 L 14 23 L 17.96875 23 L 18 23 L 18 25 L 18 25.03125 C 18.004 25.37525 18.0745 25.691 18.1875 26 L 7 26 C 6.434 26 6 25.566 6 25 L 6 23 z"></path>
    </svg>
);
/**
 * COMPONENT: Changelog Dahsboard Widget
 * -------------------------------------
 * Displays a list of recent updates ("Captain's Log")
 * Manages the state for opening a detailed view of log entry in a modal.
 * 
 * INTERACTION FLOW (Mermaid):
 * ---------------------------
 * 
 * ```mermaid
 * sequenceDiagram
 *      participant User
 *      participant ChangelogWidget
 *      participant BaseModal
 * 
 *      User->>ChangelogWidget: Clicks on a log item
 *      ChangelogWidget->>ChangelogWidget: setActiveLog(clickedLog)
 *      ChangelogWidget->>BaseModal: Renders with isOpen=true
 *      User->>BaseModal: Clicks 'Close' button
 *      BaseModal->>ChangelogWidget: Calls onClose()
 *      ChangelogWidget->>ChangelogWidget: setActiveLog(null)
 *      ChangelogWidget->>BaseModal: Renders with isOpen=false
 * ```
 */
const ChangelogWidget = ({logs = []}) => {
    const [activeLog, setActiveLog] = useState(null);

    return(
        <>
            <DashboardCard
                title="Captain's Log"
                icon={<LogIcon/>}
                scrollable={true}
            >
                <div className="changelog-list">
                    {logs.map(log => (
                        <div 
                            key={log.id}
                            className={`log-item ${log.pinged ? 'pinned' : ''}`}
                            onClick={()=> setActiveLog(log)}
                        >
                            <div className="log-top">
                                <span className="log-title">{log.title}</span>
                                    {log.pinged && ( 
                                        <span className="pin-icon">
                                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.4207 3.45395C13.5425 2.33208 15.3614 2.33208 16.4833 3.45395L20.546 7.51662C21.6679 8.63849 21.6679 10.4574 20.546 11.5793L17.1604 14.9648L19.8008 17.6052C20.1748 17.9792 20.1748 18.5855 19.8008 18.9594C19.4269 19.3334 18.8205 19.3334 18.4466 18.9594L16.0834 16.5962L15.674 18.8144C15.394 20.3314 13.5272 20.9118 12.4364 19.821L8.98476 16.3694L6.83948 18.5147C6.46552 18.8886 5.85922 18.8886 5.48526 18.5147C5.1113 18.1407 5.1113 17.5344 5.48525 17.1605L7.63054 15.0152L4.17891 11.5635C3.08815 10.4728 3.66858 8.60594 5.18551 8.32595L7.40369 7.91654L5.04048 5.55333C4.66652 5.17938 4.66652 4.57307 5.04048 4.19911C5.41444 3.82515 6.02075 3.82515 6.3947 4.19911L9.0351 6.83951L12.4207 3.45395ZM9.0351 9.54795L9.01673 9.56632L5.53313 10.2093L13.7906 18.4668L14.4336 14.9832L14.452 14.9648L9.0351 9.54795ZM15.8062 13.6106L10.3893 8.19373L13.7749 4.80818C14.1488 4.43422 14.7551 4.43422 15.1291 4.80818L19.1918 8.87084C19.5657 9.2448 19.5657 9.8511 19.1918 10.2251L15.8062 13.6106Z" fill="var(--text-accent)"/>
                                            </svg></span>)}
                            </div>
                            <span className="log-date">
                                {new Date(log.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </DashboardCard>

            <BaseModal
                isOpen={!!activeLog}
                onClose={()=> setActiveLog(null)}
                title={activeLog?.title || ''}
                size="small"
                footer={<button className="base-btn base-btn-secondary" onClick={()=> setActiveLog(null)}>Close</button>}
            >
                <div className="changelog-body" style={{color: '#cdb5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                    {activeLog?.text}
                </div>
            </BaseModal>
        
        </>
    );
};

export default ChangelogWidget;