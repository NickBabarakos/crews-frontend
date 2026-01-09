import '../../styles/App.css';
import { MenuIcon } from '../Icons';

function Header({onToggleMobileMenu, onHomeClick}){

    return(
        <div className="header-bar">
            <button className="hamburger-btn" onClick={onToggleMobileMenu} aria-label="Toggle Menu">
                <MenuIcon/>
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