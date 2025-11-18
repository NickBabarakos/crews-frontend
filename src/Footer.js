import './App.css';

function Footer({currentPage, hasMore, onPageChange, hasSearched}){
    const showPrevButton = hasSearched && currentPage > 1;
    const showNextButton = hasSearched && hasMore;
    const indicatorClass = `page-indicator ${hasSearched ? 'active': 'inactive'}`;

    return(
        <div className="footer">
            <div className="pagination-controls">
                {showPrevButton && (
                    <button onClick={() => onPageChange('prev')} className="pagination-arrow">
                        &lt;
                    </button>
                )}

                <div className={indicatorClass}> {currentPage}</div>

                {showNextButton && (
                    <button onClick={() => onPageChange('next')} className="pagination-arrow">
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );
}
export default Footer;