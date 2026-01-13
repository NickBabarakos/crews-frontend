import {useState} from 'react';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';

export const useCrewSubmission = (adminSecret, creatorData) => {
    const [formData, setFormData] = useState({
        title: '',
        stage_id: '',
        video_url: '',
        text_guide_json: ''
    });
    const [guideType, setGuideType] = useState('video');
    const [members, setMembers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () =>{
        setFormData({title: '', stage_id: '', video_url: '', text_guide_json: ''});
        setMembers({});
        setGuideType('video');
    };

    const submitCrew = async(onSuccess) =>{
        //Validation
        if(!formData.title || !formData.stage_id) return toast.error("Title and Stage ID are required");
        if(!creatorData?.id) return toast.error("Please select/verify a creator first");
        if(guideType === 'video' && !formData.video_url) return toast.error("Video URL is required");

        setIsSubmitting(true);

        //Μετατροπή του Members Object (Grid) σε Array (API Format)
        const membersArray = [];
        Object.entries(members).forEach(([pos,data]) => {
            if(data && data.id){
                const notes = data.notes || null;

                membersArray.push({
                    position: pos,
                    character_id: parseInt(data.id),
                    notes: notes 
                });
            }
        });

        try{
            const payload ={
                title: formData.title,
                stage_id: parseInt(formData.stage_id),
                creator_id: creatorData.id,
                guide_type: guideType,
                video_url: guideType === 'video' ? formData.video_url: null,
                text_guide: guideType === 'text' ? JSON.parse(formData.text_guide_json || '{}') : null,
                members: membersArray
            };

            const res = await adminService.createCrew(payload, adminSecret);

            if(res.success){
                toast.success(`SUCCESS! Crew create with ID: ${res.crewId}`);
                if (onSuccess) onSuccess(res.crewId);
            }
        } catch(err){
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message;
            toast.error(`FAILED: ${errorMsg}`);
        } finally{
            setIsSubmitting(false);
        }
    };

    return{
        formData, setFormData,
        guideType, setGuideType,
        members, setMembers,
        isSubmitting,
        submitCrew,
        resetForm
    };
};