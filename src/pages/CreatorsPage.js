import { useState } from "react";
import { useCreators } from "../hooks/useCreator";
import CreatorsView from "../creators/CreatorsView";
import Footer from "../components/layout/Footer";

const CreatorsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, error} = useCreators({
        page: currentPage,
        limit: pageSize
    });

    const handlePageChange = (direction) => {
        const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
        if(newPage > 0){
            setCurrentPage(newPage);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    return(
        <>
            {error && <p className="error-message">{error.message}</p>}

            {!isLoading && !error && (
                <CreatorsView
                    creators={data?.creators || []}
                    onPageSizeChange={(newSize) =>{ setPageSize(newSize); setCurrentPage(1);} }
                    currentPage = {currentPage}
                    pageSize={pageSize}
                />
            )}

            <Footer 
                currentPage={currentPage}
                hasMore={data?.hasMore || false}
                onPageChange={handlePageChange}
                hasSearched={true}
            />
        </>
    );
};

export default CreatorsPage;