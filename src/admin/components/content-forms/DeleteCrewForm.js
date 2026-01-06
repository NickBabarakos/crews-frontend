import React, {useState} from 'react';

function DeleteCrewForm({onDelete}) {
    const [deleteId, setDeleteId] = useState('');

    const handleSubmit = async () => {
        const success = await onDelete(deleteId);
        if (success) setDeleteId('');
    };

    return(
        <div className="form-group">
            <label>Enter Crew Id to Delete</label>
            <input 
                type="number"
                value={deleteId}
                onChange={e => setDeleteId(e.target.value)}
            />
            <button 
                className="reject-btn mt-10 w-100"
                onClick={handleSubmit}
            >DELETE CREW PERMANENTLY</button>
        </div>
    );
}

export default DeleteCrewForm;