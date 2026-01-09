
import React, {useState} from "react";
import DashboardCard from "./DashboardCard";
import BaseModal from "../../../components/modals/BaseModal";
import { LogIcon, PinIcon } from "../../../components/Icons";

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
                                        <span className="pin-icon"><PinIcon/></span>)}
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