import { useState } from "react";
import { useBanners } from "../hooks/useBanner";
import { getBannerDetails } from "../api/bannerService";
import BannersView from "../banners/BannersView";
import BannerModal from "../banners/BannerModal";
import Footer from "../components/layout/Footer";

const BannersPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [guideData, setGuideData] = useState(null);
    const [guideLoading, setGuideLoading] = useState(false);

    const { data, isLoading, error} = useBanners({
        page: currentPage,
        limit: pageSize
    });

    const handleBannerClick = async (bannerId) => {
        setIsGuideOpen(true);
        setGuideLoading(true);

        try{
            const data = await getBannerDetails(bannerId);
            setGuideData(data.guide);
        } catch(err){
            console.error("Failed to fetch banner details", err);
            setGuideData(null);
        } finally{
            setGuideLoading(false);
    }
  }

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage -1;
    if(newPage > 0){
        setCurrentPage(newPage);
        window.scrollTo({top:0, behavior: 'smooth'});
    }
  };

  return(
    <>
        {error && <p className="error-message">{error.message}</p>}

        {!isLoading && !error && (
            <BannersView 
                banners={data?.banners || []}
                onPageSizeChange={(newSize)=>{
                    if (newSize !== pageSize){
                        setPageSize(newSize);
                        setCurrentPage(1);
                    }
                }}
                onBannerClick={handleBannerClick}
            />
        )}

        <BannerModal 
            isOpen={isGuideOpen}
            onClose={()=> setIsGuideOpen(false)}
            data={guideData}
            loading={guideLoading}
        />

        <Footer 
            currentPage={currentPage}
            hasMore={data?.hasMore || false}
            onPageChange={handlePageChange}
            hasSearched={true}
        />
    </>
  );
};

export default BannersPage;