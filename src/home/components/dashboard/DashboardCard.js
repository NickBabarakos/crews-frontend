/**
 * COMPONENT: Dashboard Card(Wrapper)
 * ----------------------------------
 * A reusable UI component that provides a consistent styled container
 * for all dashboard widgets.
 * 
 * PROP STRUCTURE:
 * - title: The text displayed in the header.
 * - icon: An SVG component displayed next to the title.
 * - headerAction: A React node (e.g. buttons, tabs) fro the top-right corner
 * - children: The main content of the card.
 * - scrollable: A boolean to enable/disable vertical scrolling in the card body.
 */
import React from "react";
import './DashboardCard.css';

const DashboardCard = ({
    title,
    icon,
    headerAction,
    children,
    className = '',
    scrollable= true
}) => {
    return (
        <div className={`dashboard-card ${className}`}>
            <div className="card-header">
                <div className="header-title-group">
                    <h3>{title}</h3>
                    {icon && <span className="header-icon">{icon}</span>}
                </div>
                {headerAction && <div className="header-action">{headerAction}</div>}
            </div>

            <div className={`card-body ${scrollable ? 'is-scrollable' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default DashboardCard;