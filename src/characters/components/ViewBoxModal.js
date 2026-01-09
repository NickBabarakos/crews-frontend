import React, {useState} from 'react';
import { useCollection } from '../../context/CollectionContext';
import BaseModal from '../../components/modals/BaseModal';
import toast from 'react-hot-toast';
import '../ViewBoxControl.css';

function ViewBoxModal({isOpen, onClose}) {
    const {fetchOtherBox, isLoadingOther} = useCollection();
    const [inputKey, setInputKey] = useState('');

    const handleSearch = async () => {
        if(!inputKey.trim()) return;

        const cleanKey = inputKey.trim();
        const success = await fetchOtherBox(cleanKey);

        if(success !== false){
            onClose();
            setInputKey('');
            toast.success('Viewing User Box');
        } else{
            toast.error('Box not found');
        }
    };

    const footerButtons =(
        <>
            <button onClick={onClose} className="base-btn base-btn-secondary">
                Cancel 
            </button>
            <button 
                onClick={handleSearch}
                className="base-btn base-btn-primary"
                disabled={isLoadingOther}
            >
                {isLoadingOther ? 'Searching...' : 'Search'}
            </button>
        </>
    );

    return(
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="View Character Box"
            size="small"
            footer={footerButtons}
        >
            <div className="vb-content-wrapper">
                <p className="vb-description">
                    Enter the <strong>Public Key</strong> of the user you want to browse.
                </p>

                <input 
                    type="text"
                    className="vb-input"
                    placeholder="e.g. pub-a1b2-c3d4"
                    value={inputKey}
                    onChange={(e)=> setInputKey(e.target.value)}
                    onKeyDown={(e)=> e.key === 'Enter' && handleSearch()}
                    autoFocus 
                />
            </div> 
        </BaseModal>
    );
}

export default ViewBoxModal;