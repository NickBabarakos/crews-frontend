import React from 'react';
import { useBannerSubmission } from './hooks/useBannerSubmission';
import BannerForm from './components/BannerForm';
import './Admin.css';
import BannerModal from '../banners/BannerModal';

function InsertBannerView({adminSecret}) {
    const{
        formData,
        loading,
        previewData,
        isPreviewOpen,
        setIsPreviewOpen,
        handleChange,
        handlePreview,
        handleSubmit
    } = useBannerSubmission(adminSecret);




        return(
            <div className="insert-banner-container">
                <h3>Insert New Global/PST Banner</h3>

                <BannerForm
                    formData={formData}
                    onChange={handleChange}
                    onPreview={handlePreview}
                    onSubmit={handleSubmit}
                    loading={loading}
                />

                {isPreviewOpen && (
                    <BannerModal 
                        isOpen={true}
                        onClose={()=> setIsPreviewOpen(false)}
                        data={previewData}
                        loading={false}
                    />
                )}
            </div>
        );
    }

export default InsertBannerView;