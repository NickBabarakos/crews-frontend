import './App.css';

function Footer({currentPage, hasMore, onPageChange, hasSearched}){
    if(!hasSearched){
        return <div className="footer"></div>
    }

    const showPrevButton = currentPage> 1;
    const showNextButton = hasMore;

    return(
        <div className="footer">
            <div className="pagination-controls">
                {showPrevButton && (
                    <button onClick={() => onPageChange('prev')} className="pagination-arrow">
                        &lt;
                    </button>
                )}

                <div className="page-indicator"> {currentPage}</div>

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