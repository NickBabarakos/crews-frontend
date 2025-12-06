import React from 'react';
import {useCollection} from './CollectionContext';

const InteractiveChar = ({id, type , url, className, children, style}) =>{
    const {toggleChar} = useCollection();

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChar(id, type);
    };

    const baseStyle = {
        display: 'block',
        textDecoration: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer',
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
            onClick={()=> toggleChar(id, type)}
            onContextMenu={handleContextMenu}
            style={baseStyle}
        >{children}</div>
    );
};

export default InteractiveChar;