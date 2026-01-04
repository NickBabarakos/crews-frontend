import React from 'react';
import { useCollection } from '../../context/CollectionContext';

const InteractiveChar = ({id, type , url, className, children, style}) =>{
    const {toggleChar, viewingOther} = useCollection();

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(viewingOther) return;
        toggleChar(id, type);
    };

    const handleClick = ()=> {
        if(viewingOther) return;
        toggleChar(id, type);
    };

    const baseStyle = {
        display: 'block',
        textDecoration: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        cursor: viewingOther && !url ? 'default' : 'pointer',
        ...style
    };

    if(url){
        return(
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                onContextMenu={handleContextMenu}
                style={baseStyle}
            >
                {children}
            </a>
        );
    }

    return(
        <div 
            className={className}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            style={baseStyle}
        >{children}</div>
    );
};

export default InteractiveChar;