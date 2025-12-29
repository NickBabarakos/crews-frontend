import React, {useState} from 'react';
import { useCollection } from './CollectionContext';
import './DataTransferModal.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const CopyIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="currentColor"></path> 
    </svg>
);

function DataTransferModal({isOpen, onClose}){
    const {
        myKeys,
        createBox,
        loginWithSecret,
        importCollection,
        ownedItems
    } = useCollection();

    const [secretInput, setSecretInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if(!isOpen) return null;

    const handleCopy = (text, label) => {
        if(!text) return;
        
        const copyFallback =() =>{
            try{
                const textArea = document.createElement("textarea");
                textArea.value = text;

                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0px";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if(successful){
                    toast.success(`${label} copied`);
                } else{
                    toast.error(`Failed to copy ${label}`)
                }
            } catch(err){
                console.error('Fallback copy failed', err);
                toast.error("Browser blocked copy action");
            }
        };

        if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(text)
                .then(() => toast.success(`${label} copied`))
                .catch(()=> copyFallback());
        } else {
            copyFallback();
        }
    };

    const handleCreateBox = async () => {
        setIsLoading(true);
        const keys = await createBox(ownedItems);
        setIsLoading(false);
        if (keys) {
            toast.success('Character Box Created!');
        } else {
            toast.error('Failed to create box.');
        }
    };

    const handleLogin = async () => {
        if(!secretInput.trim()) return;
        setIsLoading(true);
        const success = await loginWithSecret(secretInput.trim());
        setIsLoading(false);

        if(success){
            toast.success('Box Loaded Successfully!');
            setSecretInput('');
        } else{
            toast.error('Invalid Secret Key or Box not found.');
        }
    };

    const handleSelectAll = async () => {
        if(!window.confirm("Are you sure? This will overwrite your current box with ALL characters")) return;

        setIsLoading(true);
        try{
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/characters/all-ids`);

            const allChars={};
            res.data.forEach(char => {
                allChars[char.id]=char.type;
            });

            importCollection(allChars);
            toast.success(`Added ${res.data.length} characters`);
        } catch(err){
            console.error(err);
            toast.error("Failed to fetch characters.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnselectAll = () => {
        if(!window.confirm("Are you sure? This will REMOVE ALL characters from your box.")) return;

        importCollection({});
        toast.success("All characters removed");
    };

    return(
        <div className="dt-backdrop" onClick={onClose}>
            <div className="dt-modal" onClick={e=>e.stopPropagation()}>
                <div className="dt-header">
                    <h3> Sync & Manage Data</h3>
                    <button className="dt-close" onClick={onClose}>&times;</button>
                </div>

                <div className="dt-content">

                    <div className="keys-container">
                        <div className="key-row">
                            <span className="key-label">Public Key:</span>
                            <code className="key-value">{myKeys?.publicKey || '................'}</code>
                            <button 
                                className="copy-btn"
                                onClick={()=> handleCopy(myKeys?.publicKey, 'Public Key')}
                                disabled={!myKeys}
                            >  <CopyIcon/>
                            </button>
                        </div>
                        <div className="key-row">
                            <span className="key-label">Secret Key:</span>
                            <code className="key-value secret">{myKeys?.secretKey || '................'} </code>
                            <button 
                                className="copy-btn"
                                onClick={()=> handleCopy(myKeys?.secretKey, 'Secret Key')}
                                disabled={!myKeys}
                            >
                                <CopyIcon/>
                            </button>
                        </div>
                    </div>

                    <hr className="dt-divider"/>

                    {!myKeys ? (
                        <div className="action-section">
                            <div className="action-card create">
                                <h4>New User?</h4>
                                <p>Create a box to save your characters permanently and sync across devices</p>
                                <button 
                                    className="primary-btn"
                                    onClick={handleCreateBox}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating...' : 'Create New Character Box'}
                                </button>
                            </div>

                            <div className="action-card login">
                                <h4>Existing User?</h4>
                                <p>Enter your <strong>Secret Key</strong> to restore your box.</p>
                                <div className="input-group">
                                    <input 
                                        type="text"
                                        placeholder="Paste Secret Key here..."
                                        value={secretInput}
                                        onChange={(e)=> setSecretInput(e.target.value)}
                                    />
                                    <button 
                                        className="secondary-btn"
                                        onClick={handleLogin}
                                        disabled={isLoading || !secretInput}
                                    >
                                        Load 
                                    </button>
                                </div>
                            </div>
                        </div>
                    ): (
                        <div className="action-section">
                            <div className="action-card login">
                                <h4>Switch Account</h4>
                                <p>Want to load a different box? Enter its Secret Key Below:</p>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Paste Secret Key here..."
                                        value={secretInput}
                                        onChange={(e)=> setSecretInput(e.target.value)}
                                    />
                                    <button 
                                        className="change-box-btn"
                                        onClick={handleLogin}
                                        disabled={isLoading || !secretInput}
                                    >
                                        Change Box
                                    </button>
                                </div>
                            </div>

                            <div className="action-card bulk-tools">
                                <h4>Bulk Tools</h4>
                                <p>Manage your entire box at once. <span className="warning">Caution!</span></p>
                                <div className="button-row">
                                    <button 
                                        className="tool-btn select-all"
                                        onClick={handleSelectAll}
                                        disabled={isLoading}
                                    >Select All Characters</button>
                                    <button 
                                        className="tool-btn unselect-all"
                                        onClick={handleUnselectAll}
                                        disabled={isLoading}
                                    >Unselect All</button>
                                </div>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default DataTransferModal;