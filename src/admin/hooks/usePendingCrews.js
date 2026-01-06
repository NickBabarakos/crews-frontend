import {useState, useEffect, useCallback} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const usePendingCrews = (adminSecret) => {
    const [crews, setCrews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPendingCrews = useCallback(async () => {
        setLoading(true);
        try{
            const data = await adminService.getPendingCrews(adminSecret);
            setCrews(data);
        } catch (err){
            console.error(err);
            toast.error("Failed to fetch pending crews");
        } finally {
            setLoading(false);
        }
    }, [adminSecret]);

    //Initial Fetch
    useEffect(()=> {
        fetchPendingCrews();
    }, [fetchPendingCrews]);

    //Helper για να αφαιρούμε το crew απο τη λιστα τοπικα (χωρις re-fetch)
    const removeCrewFromList = (id) =>{
        setCrews(prev => prev.filter(c=> c.id !== id));
    };

    //Helper για διαγραφη απο τη βαση (Cleanup μετα απο Approve)
    const deletePendingEntry = async (id) =>{
        try{
            await adminService.rejectPendingCrew(id, adminSecret); //Το reject κανει delete
            removeCrewFromList(id);
        } catch(err) {
            console.error("Cleanup failed", err);
            toast.error("Crew approved but failed to clear pending list. Delete manually");
        }
    };

    return{
        crews,
        loading,
        fetchPendingCrews,
        removeCrewFromList,
        deletePendingEntry
    };
};