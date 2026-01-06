import React from 'react';

function BannerForm({formData, onChange, onPreview, onSubmit, loading}){
    return(
         <div className="admin-form">
            <div className="form-group">
                <label>Banner Title</label>
                <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="e.g 10.5 Anniversary Sugo-Fest"
                />
            </div>

            <div className="form-group">
                <label>Image URL Path</label>
                <input 
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={onChange}
                    placeholder="/banners_bg/banner_name.png"
                />
            </div>

            <div className="form-group">
                <label>Start Date (PST Timezone)</label>
                <input 
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label>End Date (PST Timezone)</label>
                <input 
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label>Banner Content (JSON)</label>
                <textarea 
                    name="data_json"
                    className="json-editor"
                    value={formData.data_json}
                    onChange={onChange}
                    rows={12}
                />
            <button 
                className="admin-ctrl-btn preview mt-10 w-fit"
                onClick={onPreview}
            >Preview Banner Layout</button>
        </div>

        <button
            className="submit-btn"
            onClick={onSubmit}
            disabled={loading}
        >
            {loading ? 'Creating...' : 'Create Banner'}
        </button>
    </div>
    );
}

export default BannerForm;