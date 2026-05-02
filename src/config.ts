let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

// If the URL is just a host (like on Render), prepend https://
if (API_BASE_URL && !API_BASE_URL.startsWith('http')) {
    API_BASE_URL = `https://${API_BASE_URL}`;
}

export default API_BASE_URL;
