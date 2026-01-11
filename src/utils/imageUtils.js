export const CDN_BASE_URL = "https://optc-crews-assets.github.io/optc-crews-assets";

/**
 * Μετατρέπει τα τοπικα paths σε CDN URLs
 * @params {string} path - Το path απο τη βαση 
 * @returns {string} - Το πλήρες URL για το Github
 */

export const getImageUrl = (path) => {
    if(!path) return "";
    if(path.startsWith("http")) return path;

    const safePath = path.startsWith("/") ? path : `/${path}`;

    return `${CDN_BASE_URL}${safePath}`;
};