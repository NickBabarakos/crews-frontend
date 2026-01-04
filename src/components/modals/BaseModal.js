import React, {useEffect} from "react";
import {createPortal } from 'react-dom';
import './BaseModal.css';
import { CloseIcon } from "../Icons";

/**
 * REUSABLE MODAL WRAPPER
 * ----------------------
 * A generic modal container using React Portals to render outside the DOM hirerachy.
 * 
 * Features:
 * - Accessibility: Closes on ESC key.
 * - Structure: Strandardized Header,Body (Scrollable), and Footer areas.
 * - Portal: Renders directly into document.body to avoid z-index issues.
 * 
 * @param {boolean} isOpen - If the modal is open
 * @param {function} onClose - Closing function
 * @param {string|ReactNode} title - Header title
 * @param {string} size - 'small' | 'medium' | 'large' | 'auto' (default: medium)
 * @param {ReactNode} footer - (Optional) Button for the bottom part 
 * @param {string} className - Extra classes for custom styling
 * @param {ReactNode} children - The content 
 */

function BaseModal({
    isOpen,
    onClose,
    title,
    size= "medium",
    footer,
    className= '',
    children
}){
    useEffect(()=> {
        const handleEsc = (e) => {
            if(e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return ()=> window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if(!isOpen) return null;

    return createPortal(
        <div className="base-modal-overlay" onClick={onClose}>
            <div 
                className={`base-modal-content size-${size} ${className}`}
                onClick={(e)=> e.stopPropagation()}
            >
                {/*Header */}
                <div className="base-modal-header">
                    <h3 className="base-modal-title">{title}</h3>
                    <button className="base-close-btn" onClick={onClose} aria-label="Close">
                        <CloseIcon/>
                    </button>
                </div>

                {/*Body (Scrollable) */}
                <div className="base-modal-body">
                    {children}
                </div>

                {/*Footer (Optional) */}
                {footer && (
                    <div className="base-modal-footer">
                        {footer}
                    </div>
                )}


            </div>
        </div>,
        document.body
    );
}

export default BaseModal;