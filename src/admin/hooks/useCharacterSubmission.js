import {useState} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useCharacterSubmission = (adminSecret) =>{
    const initialState = {
            id: '',
            name: '',
            info_url: '',
            type: 'Rare Recruit'
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.id || !formData.name){
            return toast.error("ID and Name re required");
        }
        setLoading(true);

        try{
            const res = await adminService.insertCharacter(formData, adminSecret);
            toast.success(res.message || `Character "${formData.name}" added successfully`);
            setFormData(initialState);
        } catch(err){
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message;
            toast.error(`Failed to insert: ${errorMsg}`);
        } finally{
            setLoading(false);
        }
    };

    return{
        formData,
        handleChange,
        handleSubmit,
        loading
    };
};