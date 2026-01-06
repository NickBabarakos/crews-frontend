import {useState} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useCreatorManager = (adminSecret) => {
    const [status, setStatus] = useState({
        inputType: 'url',
        urlInput: '',
        step: 'search',
        data: null,
        tempName: ''
    });

    const resetCreator = () => {
        setStatus({ inputType: 'url', urlInput: '', step: 'search', data: null, tempName: ''});
    };

    const checkCreator = async () => {
        if(!status.urlInput) return toast.error("Please enter a value");

        try{
            const payload = status.inputType === 'key'
                ? { public_key: status.urlInput}
                : { social_url: status.urlInput}
            
                const data = await adminService.checkCreator(payload, adminSecret);

                if(data.exists){
                    setStatus(prev => ({...prev, step: 'verified', data: data.creator}));
                    toast.success("Creator Found!");
                } else{
                    setStatus(prev => ({...prev, step: 'not_found', data: null}));
                    toast("Creator not found. Create New?");
                }
        } catch(err){
            console.error(err);
            toast.error("Error checking creator");
        }
    };

    const createCreator = async () => {
        if(!status.tempName) return toast.error("Name required");

        try{
            const payload ={
                name: status.tempName,
                social_url: status.inputType === 'url' ? status.urlInput : null,
                public_key: status.inputType === 'key' ? status.urlInput : null
            };

            const data = await adminService.createCreator(payload, adminSecret);

            if(data.success){
                setStatus(prev => ({...prev, step: 'verified', data: data.creator}));
                toast.success("Creator Created Successfully");
            }
        } catch (err){
            toast.error("Creation failed:" + (err.response?.data?.error || err.message));
        }
    };

    const updateCreatorState = (updates) => setStatus(prev => ({...prev, ...updates}));

    return{
        creatorStatus: status,
        updateCreatorState,
        checkCreator,
        createCreator,
        resetCreator
    };
};