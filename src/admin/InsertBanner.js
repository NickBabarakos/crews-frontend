import React, {useState} from 'react';
import axios from 'axios';
import './Admin.css';
import BannerModal from '../banners/BannerModal';


const BASE_URL = process.env.REACT_APP_BASE_URL;

function InsertBanner({adminSecret}) {
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        start_date: '',
        end_date: '',
        data_json: '{"categories": \n[{"name": "", "characters_id":[]},\n {}], \n"exclusive_chance":"x%"}'
    });
    const [status, setStatus] = useState({type: '', msg: ''});
    const [loading, setLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handlePreview = () => {
        try{
            const rawData = JSON.parse(formData.data_json);

            const hydratedData = {
                ...rawData,
                categories: rawData.categories?.map(cat => ({
                    ...cat,
                    characters: (cat.character_ids || cat.characters_id || []).map(id => ({
                        id: id,
                        name: `ID: ${id}`,
                        image_url: `/unit_icons/${id}`,
                        type: 'UNKNOWN'
                    }))
                }))
            };
            setPreviewData(hydratedData);
            setIsPreviewOpen(true);
        } catch(e){
            setStatus({type: 'error', msg: 'Invalid JSON format in editor. Cannot preview'});
        }
    };

    const handleSubmit = async() => {
        setLoading(true);
        setStatus({type:'', msg: ''});

        try{
            JSON.parse(formData.data_json);

            const response = await axios.post(
                `${BASE_URL}/api/admin/banner`,
                formData,
                {headers: {'x-admin-secret': adminSecret}}
            );

            setStatus({ type: 'success', msg: response.data.message});
            setFormData({title: '', image_url: '', start_date: '', end_date: '', data_json:'{"categories": \n[{"name": "", "characters_id":[]},\n {}], \n"exclusive_chance":"x%"}' });
        } catch (err) {
            const errorMsg = err instanceof SyntaxError ? 'Invalid JSON format' : (err.response?.data?.error || 'Server error');
            setStatus({type: 'error', msg: errorMsg});
        }finally {
            setLoading(false);
        };
    }

        return(
            <div className="insert-banner-container">
                <h3>Insert New Global/PST Banner</h3>
                <div className="admin-form">
                    <div className="form-group">
                        <label>Banner Title</label>
                        <input 
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g 10.5 Anniversary Sugo-Fest"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL Path</label>
                        <input 
                            type="text"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="/banners_bg/banner_name.png"
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Date (PST Timezone)</label>
                        <input 
                            type="datetime-local"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date (PST Timezone)</label>
                        <input 
                            type="datetime-local"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Banner Content (JSON)</label>
                        <textarea 
                            name="data_json"
                            className="json-editor"
                            value={formData.data_json}
                            onChange={handleChange}
                            rows={12}
                        />
                        <button 
                            className="admin-ctrl-btn preview"
                            style={{marginTop: '10px', width: 'fit-content'}}
                            onClick={handlePreview}
                        >Preview Banner Layout</button>
                    </div>

                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Banner'}
                    </button>

                    {status.msg && (
                        <div className={`status-msg ${status.type}`}>
                            {status.msg}
                        </div>
                    )}
                </div>

                {isPreviewOpen && (
                    <BannerModal 
                        isOpen={true}
                        onClose={()=> setIsPreviewOpen(false)}
                        data={previewData}
                        loading={false}
                    />
                )}
            </div>
        );
    }

export default InsertBanner;