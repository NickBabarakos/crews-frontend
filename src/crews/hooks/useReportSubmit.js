import {useState} from 'react';
import {toast} from 'react-hot-toast';
import {submitReport} from '../../api/reportService';

/**
 * REPORT SUBMISSION LOGIC
 * Handles the API call to flag a crew with an issue.
 */

export const useReportSubmit = (onClose) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (crewId, message) => {
        // Validation
        if(!message.trim()){
            toast.error("Please write a message first.");
            return;
        }

        setIsSubmitting(true);
        try{
            await submitReport ({
                crew_id: crewId,
                message: message
            });
            toast.success("Report submitted successfully");
            onClose();
        } catch( error){
            console.error("Report failed", error);
            toast.error("Failed to submit report");
        }finally{
            setIsSubmitting(false);
        }
    };
    return {isSubmitting, submit};
};