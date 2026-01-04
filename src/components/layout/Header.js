import '../../styles/App.css';

function Header({onToggleMobileMenu, onHomeClick}){

    return(
        <div className="header-bar">
            <button className="hamburger-btn" onClick={onToggleMobileMenu} aria-label="Toggle Menu">
                <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
                    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>   
                </svg>
            </button>

            <div 
                className="logo-container"
                style={{userSelect:'none', cursor: 'pointer'}}
                onClick={onHomeClick}
            >
                <h1>
                    <span className="logo-accent">OPTC</span>
                    <span className="highlight-text">crews</span>
                </h1>
            </div>
        </div>
    );
    
}


export default Header;