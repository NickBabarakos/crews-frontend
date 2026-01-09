import React, {useState} from 'react';
import { useCollection } from '../context/CollectionContext';
import './ViewBoxControl.css';
import toast from 'react-hot-toast';
import ViewBoxModal from './components/ViewBoxModal';
import { EyeIcon } from '../components/Icons';



function ViewBoxControl(){
    const {viewingOther, exitOtherView} = useCollection();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEyeClick = () => {
        if(viewingOther){
            exitOtherView();
            toast('Returned to My Box');
        } else {
            setIsModalOpen(true);
        }
    };


    return (
        <>
            <button
                className={`view-box-btn ${viewingOther ? 'active' : ''}`}
                onClick={handleEyeClick}
                title={viewingOther ? "Exit View Mode": "View Other Box"}
            >
                <EyeIcon isOpen={viewingOther}/>
                {viewingOther && <span className="pulse-dot"></span>}
            </button>

           <ViewBoxModal
                isOpen={isModalOpen}
                onClose={()=> setIsModalOpen(false)}
            />
        
        </>
    );
}

export default ViewBoxControl;