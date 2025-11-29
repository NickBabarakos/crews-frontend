import './App.css';

function Footer({currentPage, hasMore, onPageChange, hasSearched}){
    if(!hasSearched) return null;
    const showPrevButton =  currentPage > 1;
    const showNextButton = hasMore;
    

    return(
        <div className="footer">
            <div className="pagination-controls">
                    <button 
                        onClick={() => onPageChange('prev')} 
                        className="pagination-btn prev"
                        disabled={!showPrevButton}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round"  strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                    </button>

                    <div className="page-indicator">
                        <span className="page-label">PAGE</span>
                        <span className="page-number">{currentPage}</span>
                    </div>

                    <button 
                        onClick={() => onPageChange('next')} 
                        className="pagination-btn next"
                        disabled={!showNextButton}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                
            </div>
        </div>
    );
}
export default Footer;