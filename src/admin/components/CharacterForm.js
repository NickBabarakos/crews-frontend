import React from 'react';

const CHAR_TYPES = [
    'Super Sugo-Fest Only', 'Anniversary', 'Pirate Rumble Sugo-Fest Only', 'Treasure Sugo-Fest Only', 'Pirate Alliance Kizuna Clash Sugo-Fest Only',
    'Exchange Only', 'Sugo Rare', '6+ Legend', 'Rare Recruit', 'Treasure Map Rare Recruit', 'Kizuna Clash Limited Character',
    'Rumble Rare Recruit', 'Support Character', '5+ Rare Recruit'
];

function CharacterForm({formData, onChange, onSubmit, loading}) {
    return(
        <form onSubmit={onSubmit} className="admin-form" autoComplete="off">
            <div className="form-group">
                <label>ID (In-Game Id)</label>
                <input 
                        type="number"
                        name="id"
                        value={formData.id}
                        onChange={onChange}
                        placeholder="e.g 4483"
                        required
                        autoComplete = "off"
                    />
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="e.g. Sanji & Reiju"
                        required
                        autoComplete = "off"
                    />
                </div>

                <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={onChange}>
                        {CHAR_TYPES.map(t=> <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Info URL (DB Link)</label>
                    <input 
                        type="text"
                        name="info_url"
                        value={formData.info_url}
                        onChange={onChange}
                        placeholder="https://..."
                        required
                        autoComplete = "off"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Inserting...' : 'Add Character'}
                </button>
        </form>

    );
}

export default CharacterForm;