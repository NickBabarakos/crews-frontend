import {useState, useEffect, useCallback} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useReportsManager = (adminSecret) => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReports = useCallback(async ()=> {
        setLoading(true);
        try{
            const res = await adminService.getReports(adminSecret);
            setReports(res || []);
        } catch(err){
            console.error(err);
            toast.error("Failed to load reports");
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [adminSecret]);

    useEffect(()=> {
        fetchReports();
    }, [fetchReports]);

    const resolveReport = async(id) => {
        if(!window.confirm("Mark as resolved and delete this report?")) return;

        try{
            await adminService.resolveReport(id, adminSecret);
            toast.success("Report resolved and deleted");
            
            //Αφαίρεση απο την λίστα τοπικα
            setReports(prev => prev.filter(r=> r.id !== id));
            setSelectedReport(null);
        } catch(err){
            console.error(err);
            toast.error("Failed to delete report");
        }
    };

    return{
        reports,
        selectedReport,
        setSelectedReport,
        loading,
        resolveReport,
        refreshReports: fetchReports
    };
};