import './App.css';

function Footer({currentPage, hasMore, onPageChange, hasSearched}){
    const showPrevButton = hasSearched && currentPage > 1;
    const showNextButton = hasSearched && hasMore;
    const indicatorClass = `page-indicator ${hasSearched ? 'active': 'inactive'}`;

    return(
        <div className="footer">
            <div className="pagination-controls">
                    <button 
                        onClick={() => onPageChange('prev')} 
                        className={`pagination-arrow prev ${!showPrevButton ? 'hidden' : ''}`}
                        disabled={!showPrevButton}
                    >
                    </button>

                <div className={indicatorClass}> {currentPage}</div>

                    <button onClick={() => onPageChange('next')} 
                        className={`pagination-arrow next ${!showNextButton ? 'hidden' : ''}`}
                        disabled={!showNextButton}
                    >
                    </button>
                
            </div>
        </div>
    );
}
export default Footer;