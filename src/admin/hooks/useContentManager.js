import {useState} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useContentManager = (adminSecret) => {
    const [activePill, setActivePill ] = useState('pka');
    const [loading, setLoading ] = useState(false);
    
    //Preview State
    const [previewData, setPreviewData] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (jsonString) => {
        try{
            const parsed = JSON.parse(jsonString);
            setPreviewData(parsed);
            setIsPreviewOpen(true);
        } catch (e) {
            toast.error("Invalid JSON format");
        }
    };

    const handleUpdateEvent = async (mode, data) => {
        if(!window.confirm(`Are you sure you want to rotate/update ${mode}? This will delete old crews`)) return;

        setLoading(true);
        try{
            await adminService.updateEventContent(mode, data, adminSecret);
            toast.success(`${mode.toUpperCase()} content updated`);
        } catch (err) {
            toast.error("Error:" + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCrew = async (deleteId) => {
        if(!deleteId) return toast.error("Please enter an ID");
        if(!window.confirm(`PERMANENTLY DELETE CREW #${deleteId}?`)) return;

        try{
            await adminService.deleteCrew(deleteId, adminSecret);
            toast.success(`Crew #${deleteId} deleted`);
            return true;
        } catch (err){
            toast.error("Error deleting crew");
            return false;
        }
    };

    return{
        activePill, setActivePill,
        loading,
        previewData,
        isPreviewOpen, setIsPreviewOpen,
        handlePreview,
        handleUpdateEvent,
        handleDeleteCrew
    };
};