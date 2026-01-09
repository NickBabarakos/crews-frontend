import '../../styles/App.css';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

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
                        <ChevronLeftIcon/>
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
                        <ChevronRightIcon/>
                    </button>
                
            </div>
        </div>
    );
}
export default Footer;