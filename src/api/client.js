import axios from 'axios';

/**
 * CORE API CLIENT
 * ---------------
 * Centralized axios intsance with base configuration.
 * Loads the BASE_URL from enviroment variables.
 * Used by all service files to ensure consistent headersand timeout settings.
 */
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient; 