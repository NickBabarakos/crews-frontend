import React from 'react';
import { useCharacterSubmission } from './hooks/useCharacterSubmission';
import CharacterForm from './components/CharacterForm';
import './Admin.css';


function InsertCharacterView({adminSecret}) {
    const {formData, handleChange, handleSubmit, loading} = useCharacterSubmission(adminSecret);

    return(
        <div className="insert-char-container">
            <h3>Insert New Character</h3>
            <CharacterForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}

export default InsertCharacterView;