import React from "react";

export const SearchIcon = () => (
       <svg 
        className="search-icon" 
        width="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

export const MobileFilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
        <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
        <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
        <line x1="17" y1="16" x2="16" y2="16"></line>
    </svg>
)

export const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
)

export const ArrowIcon = () => (
       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.61109 12.4L10.8183 18.5355C11.0462 19.6939 12.6026 19.9244 13.1565 18.8818L19.0211 7.84263C19.248 7.41555 19.2006 6.94354 18.9737 6.58417M9.61109 12.4L5.22642 8.15534C4.41653 7.37131 4.97155 6 6.09877 6H17.9135C18.3758 6 18.7568 6.24061 18.9737 6.58417M9.61109 12.4L18.9737 6.58417M19.0555 6.53333L18.9737 6.58417" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CommentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

export const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg> 
);

export const SelectionIcon = () => (
     <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const EyeIcon = (props) => (
       <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="0" {...props}>
        <path 
            fill="currentColor" 
            fillRule="evenodd" 
            d="M3.415 10.242c-.067-.086-.13-.167-.186-.242a16.806 16.806 0 011.803-2.025C6.429 6.648 8.187 5.5 10 5.5c1.813 0 3.57 1.148 4.968 2.475A16.816 16.816 0 0116.771 10a16.9 16.9 0 01-1.803 2.025C13.57 13.352 11.813 14.5 10 14.5c-1.813 0-3.57-1.148-4.968-2.475a16.799 16.799 0 01-1.617-1.783zm15.423-.788L18 10l.838.546-.002.003-.003.004-.01.016-.037.054a17.123 17.123 0 01-.628.854 18.805 18.805 0 01-1.812 1.998C14.848 14.898 12.606 16.5 10 16.5s-4.848-1.602-6.346-3.025a18.806 18.806 0 01-2.44-2.852 6.01 6.01 0 01-.037-.054l-.01-.016-.003-.004-.001-.002c0-.001-.001-.001.837-.547l-.838-.546.002-.003.003-.004.01-.016a6.84 6.84 0 01.17-.245 18.804 18.804 0 012.308-2.66C5.151 5.1 7.394 3.499 10 3.499s4.848 1.602 6.346 3.025a18.803 18.803 0 012.44 2.852l.037.054.01.016.003.004.001.002zM18 10l.838-.546.355.546-.355.546L18 10zM1.162 9.454L2 10l-.838.546L.807 10l.355-.546zM9 10a1 1 0 112 0 1 1 0 01-2 0zm1-3a3 3 0 100 6 3 3 0 000-6z"
        ></path> 
    </svg>
); 

export const LogIcon = () => (
     <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M 10 4 C 8.355 4 7 5.355 7 7 L 7 21 L 4 21 L 4 25 C 4 26.645 5.355 28 7 28 L 21 28 L 21.03125 28 C 22.66025 27.984 24 26.633 24 25 L 24 11 L 28 11 L 28 7 C 28 5.355 26.645 4 25 4 L 10 4 z M 10 6 L 22.1875 6 C 22.0745 6.316 22 6.648 22 7 L 22 25 C 22 25.566 21.566 26 21 26 C 20.437 26.008 20.008 25.562 20 25 L 19.96875 21 L 9 21 L 9 7 C 9 6.434 9.434 6 10 6 z M 25 6 C 25.566 6 26 6.434 26 7 L 26 9 L 24 9 L 24 7 C 24 6.434 24.434 6 25 6 z M 6 23 L 14 23 L 17.96875 23 L 18 23 L 18 25 L 18 25.03125 C 18.004 25.37525 18.0745 25.691 18.1875 26 L 7 26 C 6.434 26 6 25.566 6 25 L 6 23 z"></path>
    </svg>
);

export const PinIcon = () => (
    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4207 3.45395C13.5425 2.33208 15.3614 2.33208 16.4833 3.45395L20.546 7.51662C21.6679 8.63849 21.6679 10.4574 20.546 11.5793L17.1604 14.9648L19.8008 17.6052C20.1748 17.9792 20.1748 18.5855 19.8008 18.9594C19.4269 19.3334 18.8205 19.3334 18.4466 18.9594L16.0834 16.5962L15.674 18.8144C15.394 20.3314 13.5272 20.9118 12.4364 19.821L8.98476 16.3694L6.83948 18.5147C6.46552 18.8886 5.85922 18.8886 5.48526 18.5147C5.1113 18.1407 5.1113 17.5344 5.48525 17.1605L7.63054 15.0152L4.17891 11.5635C3.08815 10.4728 3.66858 8.60594 5.18551 8.32595L7.40369 7.91654L5.04048 5.55333C4.66652 5.17938 4.66652 4.57307 5.04048 4.19911C5.41444 3.82515 6.02075 3.82515 6.3947 4.19911L9.0351 6.83951L12.4207 3.45395ZM9.0351 9.54795L9.01673 9.56632L5.53313 10.2093L13.7906 18.4668L14.4336 14.9832L14.452 14.9648L9.0351 9.54795ZM15.8062 13.6106L10.3893 8.19373L13.7749 4.80818C14.1488 4.43422 14.7551 4.43422 15.1291 4.80818L19.1918 8.87084C19.5657 9.2448 19.5657 9.8511 19.1918 10.2251L15.8062 13.6106Z" fill="var(--text-accent)"/>
    </svg>
);

export const StarIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z"></path>
    </svg>
);

export const MissionIcon = () => (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 2a1 1 0 0 0-1 1v1.001c-.961.014-1.34.129-1.721.333a2.272 2.272 0 0 0-.945.945C3.116 5.686 3 6.09 3 7.205v10.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h11.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926V7.205c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C19.34 4.13 18.961 4.015 18 4V3a1 1 0 1 0-2 0v1H8V3a1 1 0 0 0-1-1zM5 9v8.795c0 .427.019.694.049.849.012.06.017.074.049.134a.275.275 0 0 0 .124.125c.06.031.073.036.134.048.155.03.422.049.849.049h11.59c.427 0 .694-.019.849-.049a.353.353 0 0 0 .134-.049.275.275 0 0 0 .125-.124.353.353 0 0 0 .048-.134c.03-.155.049-.422.049-.849L19.004 9H5zm8.75 4a.75.75 0 0 0-.75.75v2.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5z" fill="currentColor"></path>
    </svg>
);

export const TimerIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M10 3H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
        <path d="M12 13V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
);

export const PlayIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DocIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9H8"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const PlusIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000.svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SortIcon = (props) => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M8.46967 17.5303C8.76256 17.8232 9.23744 17.8232 9.53033 17.5303C9.82322 17.2374 9.82322 16.7626 9.53033 16.4697L8.46967 17.5303ZM6 14V13.25C5.69665 13.25 5.42318 13.4327 5.30709 13.713C5.191 13.9932 5.25517 14.3158 5.46967 14.5303L6 14ZM18 14.75C18.4142 14.75 18.75 14.4142 18.75 14C18.75 13.5858 18.4142 13.25 18 13.25V14.75ZM15.5303 6.46967C15.2374 6.17678 14.7626 6.17678 14.4697 6.46967C14.1768 6.76256 14.1768 7.23744 14.4697 7.53033L15.5303 6.46967ZM18 10V10.75C18.3033 10.75 18.5768 10.5673 18.6929 10.287C18.809 10.0068 18.7448 9.68417 18.5303 9.46967L18 10ZM6 9.25C5.58579 9.25 5.25 9.58579 5.25 10C5.25 10.4142 5.58579 10.75 6 10.75L6 9.25ZM9.53033 16.4697L6.53033 13.4697L5.46967 14.5303L8.46967 17.5303L9.53033 16.4697ZM6 14.75H18V13.25H6V14.75ZM14.4697 7.53033L17.4697 10.5303L18.5303 9.46967L15.5303 6.46967L14.4697 7.53033ZM18 9.25H6L6 10.75H18V9.25Z" fill="currentColor"></path> 
    </svg>
);

export const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points = "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

export const GuideIcon = () => (
    <svg width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.253V19.25M12 6.253C10.588 5.48 8.657 5 6.5 5C4.195 5 2.127 5.568 0.548 6.536C0.207 6.746 0 7.108 0 7.508V20.662C0 21.282 0.655 21.678 1.207 21.365C2.696 20.52 4.673 20 6.5 20C8.657 20 10.588 20.48 12 21.253M12 6.253C13.412 5.48 15.343 5 17.5 5C19.805 5 21.873 5.568 23.452 6.536C23.793 6.746 24 7.108 24 7.508V20.662C24 21.282 23.345 21.678 22.793 21.365C21.304 20.52 19.327 20 17.5 20C15.343 20 13.412 20.48 12 21.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const FavoriteStarIcon = ({filled, ...props}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {filled ? (
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ):(
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
    </svg>
);

export const CopyIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="currentColor"></path> 
    </svg>
);

export const YouTubeIcon = (props) => (
    <svg viewBox="0 0 512 512" width="24" height="24" fill="currentColor" {...props}>
        <path d="M94.32 70.473c-12.257.27-25.32 12.332-36.568 29.64a145.732 145.732 0 0 1 19.855-12.115c-31.622 23.364-46.658 83.72-47.166 122.336C43.54 191.32 70.73 160.196 96 174.964c-28.952-6.018-47.296 38.325-56.428 58.606 22.808-9.36 39.494-24.152 72.428-24.523-32.47 21.4-43.966 44.83-56.428 68.168 23.376-14.505 40.286-22.99 55.528-26.227 13.683-16.43 28.01-33.093 43.728-46.746 11.79-10.24 24.533-18.877 38.37-24.043-16.805-46.114-42.764-88.828-89.626-107.49-3-1.6-6.1-2.307-9.252-2.237zM207.578 194.64c-14.066 3.29-27.57 11.573-40.947 23.192-17.53 15.227-34.353 35.82-50.868 55.703-16.515 19.884-32.62 39.088-50.287 51.707-13.545 9.674-29.157 15.164-45.014 12.565 2.883 14.468 9.866 33.213 19.38 50.42 12.655 22.886 30.036 43.342 44.482 50.59 6.637 3.328 12.566 3.416 21.23 1.243 8.662-2.173 19.453-6.957 32.762-12.52C164.934 416.41 201.78 402.6 256 402.6c54.22 0 91.066 13.81 117.686 24.94 13.31 5.563 24.1 10.347 32.763 12.52 8.662 2.173 14.59 2.085 21.228-1.244 14.446-7.247 31.827-27.703 44.482-50.59 9.514-17.206 16.497-35.95 19.38-50.42-15.858 2.6-31.47-2.89-45.015-12.564-17.667-12.62-33.772-31.823-50.287-51.707s-33.337-40.476-50.87-55.703c-13.376-11.62-26.88-19.902-40.946-23.193 3.024 13.966-.075 26.363-7.594 34.985-10.06 11.535-25.643 16.307-40.828 16.307-15.185 0-30.77-4.772-40.828-16.307-7.52-8.622-10.618-21.02-7.594-34.986zm113.04 35.702c8.495-.304 17.71 10.54 7.925 22.465 16.326-15.08 30.872 6.004 13.81 13.808-13.26 6.065-25.986 13.423-37.937 21.86a32.33 32.33 0 0 1 1.584 9.958c0 10.202-2.76 19.5-10.88 26.696l-1.18 1.055-.047 1.582-.11 4.397c13.784 10.594 29.233 19.1 46.635 25.016 20.08 6.825 5.405 31.39-15.922 15.912 18.035 18.658-6.53 32.908-14.275 14.275-4.626-11.13-10.36-21.786-17.02-31.887l-.007.233c-1.505.906-4.646 2.64-9.295 4.308V340.6h-9.343v21.583c-3.997.946-6.635 1.68-11.875 1.94v-20.516h-11.344v20.565c-5-.19-7.527-.81-11.518-1.645V340.6h-9.344v20c-5.884-1.864-9.905-3.948-11.69-4.96l-.01-.298c-6.652 10.092-12.38 20.738-17.003 31.855-7.746 18.632-32.31 4.384-14.274-14.275-21.327 15.48-36.005-9.097-15.924-15.922 17.313-5.885 32.705-14.322 46.435-24.84l-.156-4.687-.05-1.547-1.152-1.032C208.72 317.74 206 308.48 206 298.396c0-3.362.53-6.647 1.533-9.798-11.935-8.415-24.646-15.747-37.883-21.8-17.063-7.806-2.527-28.89 13.8-13.812-9.574-11.666-.968-22.302 7.364-22.474 3.52-.073 6.99 1.722 9.024 6.086 5.733 12.305 12.05 24.032 19.04 35.013 8.91-7.97 21.735-13.142 36.214-13.352H256c14.805 0 27.942 5.186 37.03 13.28 7.024-11.008 13.372-22.763 19.124-35.11 1.926-4.134 5.14-5.967 8.463-6.086zM224.7 293.228c-4.483.056-7.877 1.904-8.042 7.28 0 8.555 6.923 15.498 15.485 15.498 8.555 0 15.496-6.943 15.496-15.498 0 0-13.757-7.395-22.94-7.28zm62.624 0c-9.18-.116-22.937 7.28-22.937 7.28 0 8.555 6.94 15.498 15.496 15.498 8.555 0 15.484-6.943 15.484-15.498-.164-5.376-3.56-7.224-8.043-7.28zm-31.336 18.96l-7.994 17.84h15.988l-7.994-17.84z"/>
    </svg>
);

export const DiscordIcon = (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
        <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5 .26-2.93 .71-4.27 1.33c-.01 0-.02 .01-.03 .02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02 .01 .04 .03 .05c1.8 1.32 3.53 2.12 5.2 2.65c.03 .01 .06 0 .07-.02c.4-.55 .76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08 .01-.11c.11-.08 .22-.17 .33-.25c.02-.02 .05-.02 .07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01 .05-.01 .07 .01c.11 .09 .22 .17 .33 .26c.04 .03 .04 .09 .01 .11c-.52 .31-1.07 .56-1.64 .78c-.04 .01-.05 .06-.04 .09c.32 .61 .68 1.19 1.07 1.74c.03 .01 .06 .02 .09 .01c1.72-.53 3.48-1.33 5.2-2.65c.02-.01 .03-.03 .03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9 .96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9 .96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
    </svg>
);

export const TransferIcon = (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2 3 H22 V21 H2 Z M2 8 H22 V9 H2 Z M8 13 H16 V15 H8 Z"/>
    </svg>
);

export const MenuIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
        <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>   
    </svg>
);

export const ChevronLeftIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const ChevronRightIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const TrashIcon = (props) => (
    <svg 
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        {...props}
    >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const ChevronDownIcon = (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
         <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ClockIcon = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <circle cx="12" cy="13" r="7" />
        <path d="M12 13V10" />
    </svg>
);