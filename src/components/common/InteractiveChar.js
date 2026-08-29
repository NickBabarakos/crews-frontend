import React, { useRef } from 'react';
import { useCollection } from '../../context/CollectionContext';

const InteractiveChar = ({ id, type, url, className, children, style }) => {
    const { toggleChar, viewingOther } = useCollection();
    
    // Refs για τη διαχείριση του Long Press στα κινητά
    const timerRef = useRef(null);
    const isLongPressRef = useRef(false);

    const handleAction = () => {
        if (viewingOther) return;
        toggleChar(id, type);
    };

    // Δεξί κλικ για Desktop / Android standard context menu
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAction();
    };

    // Έναρξη αφής (Mobile Long Press)
    const handleTouchStart = () => {
        isLongPressRef.current = false;
        timerRef.current = setTimeout(() => {
            isLongPressRef.current = true;
            handleAction();
            // Μικρό vibration (δόνηση) αν υποστηρίζεται
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500); // 500ms για να θεωρηθεί long press
    };

    // Τερματισμός αφής
    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    // Αν ο χρήστης σύρει το δάχτυλο (scroll), ακυρώνουμε το long press
    const handleTouchMove = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    // Χειρισμός click
    const handleClick = (e) => {
        // Αν προήλθε από long press, σταματάμε το άνοιγμα του link
        if (isLongPressRef.current) {
            e.preventDefault();
            e.stopPropagation();
            isLongPressRef.current = false;
            return;
        }

        // Αν δεν υπάρχει url, το απλό tap/click κάνει toggle
        if (!url) {
            handleAction();
        }
    };

    const baseStyle = {
        display: 'block',
        textDecoration: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none', // Απενεργοποιεί το native iOS link preview sheet
        WebkitUserSelect: 'none',
        userSelect: 'none',
        cursor: viewingOther && !url ? 'default' : 'pointer',
        ...style
    };

    if (url) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                style={baseStyle}
            >
                {children}
            </a>
        );
    }

    return (
        <div 
            className={className}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            style={baseStyle}
        >
            {children}
        </div>
    );
};

export default InteractiveChar;