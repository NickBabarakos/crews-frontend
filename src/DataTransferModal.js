import React, {useState, useRef} from 'react';
import { useCollection } from './CollectionContext';
import './DataTransferModal.css';

const DownloadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12"y1="15"x2="12"y2="3"/>
    </svg>
);

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16"/><line x1="12"y1="12"x2="12"y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/><polyline points="16 16 12 12 8 16"/>
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{color: '#4ade80'}}>
        <polyline points="20 6 9 17 4 12"/>
    </svg>
)
function DataTransferModal ({isOpen, onClose}){
    const {ownedItems, importCollection } = useCollection();
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState({type:'', message: ''});

    if(!isOpen) return null;

    const handleExport = () => {
        try{
            const dataStr = JSON.stringify(ownedItems, null, 2);
            const blob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href= url;
            link.download = `optc-collection-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus({type: 'success', message: 'Collection exported sucessfully'});

        } catch (err){
            setStatus({type: 'error', message: 'Export failed.'});
        }

    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try{
                let content = event.target.result;
                if(content.charCodeAt(0) === 0xFEFF){
                    content.slice(1);
                }

                content = content.trim();

                const json = JSON.parse(content);
                const result = importCollection(json);

                if(result.success){
                    setStatus({type: 'success', message: 'Successfully imported items!'});
                    setTimeout(()=> {
                        onClose();
                        setStatus({type: '', message: ''});
                    }, 1500);
                } else {
                    setStatus({type: 'error', message: 'Invalid data format in file'});
                }
            } catch(err) {
                console.error(err);
                setStatus({type: 'error', message: `Import Failed: ${err.message}`});
            }
        };
        e.target.value='';
        reader.readAsText(file);
    };

    return(
        <div className="dt-backdrop" onClick={onClose}>
            <div className="dt-modal" onClick={e=> e.stopPropagation()}>
                <div className="dt-header">
                    <h3>Sync Data</h3>
                    <button className="dt-close" onClick={onClose}>&times;</button>
                </div>

                <p className="dt-subtitle">
                    Save your collection to a file ore restore it on another device.
                    <br/> <span style={{fontSize:'0.85em', opacity: 0.7}}>No data is sent to any server.</span>
                </p>

                <div className="dt-actions">
                    <div className="dt-card export" onClick={handleExport}>
                        <div className="dt-icon-circle export-bg">
                            <DownloadIcon />
                        </div>
                        <div className="dt-info">
                            <h4>Export</h4>
                            <span>Save to device</span>
                        </div>
                    </div>

                    <div className="dt-card import" onClick={()=> fileInputRef.current.click()}>
                        <div className="dt-icon-circle import-bg">
                            <UploadIcon />
                        </div>
                        <div className="dt-info">
                            <h4>Import</h4>
                            <span>Load from file</span>
                        </div>
                        <input 
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            style={{display:'none'}}
                            onChange={handleFileSelect}
                            onClick={(e)=> e.target.value = null}
                        />
                    </div>
                </div>

                {status.message && (
                    <div className={`dt-status ${status.type}`}>
                        {status.type === 'success' && <CheckIcon/>}
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DataTransferModal;