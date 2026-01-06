import {useState} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useBannerSubmission = (adminSecret) => {
    const defaultJson =  '{"categories": \n[{"name": "", "characters_id":[]},\n {}], \n"exclusive_chance":"x%"}';

    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        start_date: '',
        end_date: '',
        data_json: defaultJson 
    });

    const [loading, setLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const handleChange = (e) => { 
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handlePreview = () => {
        try{
            const rawData = JSON.parse(formData.data_json);

            const hydratedData = {
                ...rawData,
                categories: rawData.categories?.map(cat => ({
                    ...cat,
                    characters: (cat.character_ids || cat.characters_id || []).map(id => ({
                        id: id,
                        name: `ID: ${id}`,
                        image_url: `/unit_icons/${String(id).padStart(4,'0')}`,
                        type: 'UNKNOWN'
                    }))
                }))
            };
            setPreviewData(hydratedData);
            setIsPreviewOpen(true);
        } catch(e){
            toast.error('Invalid JSON format. Cannot preview');
        }
    };

    
    const handleSubmit = async() => {
        if(!formData.title) return toast.error("Title is required");

        setLoading(true);

        try{
            //Validate JSON before sending
            JSON.parse(formData.data_json);

            const res = await adminService.insertBanner(formData, adminSecret);
            toast.success(res.message || "Banner created successfully");
            setFormData({title: '', image_url: '', start_date: '', end_date: '', data_json:defaultJson });
        }catch(err){
            const errorMsg = err instanceof SyntaxError ? 'Invalid JSON format' : (err.response?.data?.error || 'Server error');
            toast.error(`Error: ${errorMsg}`);
        }finally {
            setLoading(false);
        }
    };

    return{
        formData,
        loading,
        previewData,
        isPreviewOpen,
        setIsPreviewOpen,
        handleChange,
        handlePreview,
        handleSubmit
    };
    
};