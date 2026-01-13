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
 * - **Portal Rendering:** Renders into `document.body` to avoid z-index/overflow issues.
 * - **Accessibility:** Includes keyboard listeners (Esc Key) and focus management.
 * - **Layout:** Standardized layout (Header, Scrollable Body, Fixed Footer)
 * 
 * @param {Object} props - The component properties.
 * @param {boolean} props.isOpen - State flag. Determines if the component performs Conditional Rendering or returns null.
 * @param {function} props.onClose - Callback function (Event Handler). Lifts state up to the parent to set `isOpen` to false.
 * @param {React.ReactNode} props.title - The content for the Modal Header (String or JSX Element).
 * @param {'small' | 'medium' | 'large' | 'full'} [props.size="medium"] -CSS modifier for the modal width. Defaults to "medium".
 * @param {React.ReactNode} [props.footer] - Optional JSX to render in the fixed footer area (usually Action Buttons)
 * @param {string} [props.className] - Optional CSS class for style extension/overrides.
 * @param {React.ReactNode} props.children - The projected content (slot) to be rendered inside the Modal Body.
 * 
 * @returns {import('react').ReactPortal | null} The Portal containing the modal UI or null if closed.
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
//--- SIDE EFFECT: KEYBOARD ACCESSIBILITY ---
    //Handles the 'Escape' Key press to close the modal.
    useEffect(()=> {
        const handleEsc = (e) => {
            //Check Condition: Key is Escape and Modal is actually open.
            if(e.key === 'Escape' && isOpen) onClose();
        };
        //SETUP: Add event listener to the global window object (Mounting phase).
        window.addEventListener('keydown', handleEsc);

        //CLEANUP: Remove event listener to prevent Memory Leaks (Unmounting phase).
        return ()=> window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

//---- CONDITIONAL RENDERING (Early Retun) ---
    //If the modal is closed, we stop here. 
    if(!isOpen) return null;

//--- RENDER PHASE (PORTAL)---
    //We use createPortal to render outside the parent hierarchy (into document.body). 
    //This ensures the modal floats above everything else (avoids z-index/overflow issues).
    return createPortal(
        //BACKDROP(Overlay)- Clicking the dark background triggers the onClose action.
        <div className="base-modal-overlay" onClick={onClose}>

            <div 
                className={`base-modal-content size-${size} ${className}`}
                onClick={(e)=> e.stopPropagation()} //Prevents clicks inside the modal from "bubbling up" to the overlay.
            >
                {/*Header Section*/}
                <div className="base-modal-header">
                    <h3 className="base-modal-title">{title}</h3>
                    <button className="base-close-btn" onClick={onClose} aria-label="Close">
                        <CloseIcon/>
                    </button>
                </div>

                {/*Main Content Slot (Projected Content)*/}
                <div className="base-modal-body">
                    {children}
                </div>

                {/*Footer Slot (Conditional Rendering) */}
                {/*Only renders if a footer prop is provided*/}
                {footer && (
                    <div className="base-modal-footer">
                        {footer}
                    </div>
                )}


            </div>
        </div>,
        document.body //The target DOM node for the portal.
    );
}

export default BaseModal;