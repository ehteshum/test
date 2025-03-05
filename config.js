const CONFIG = {
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    corsProxyUrl: "https://corsproxy.io/?"
};

// Function to determine if we're running on GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io');
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    if (isGitHubPages()) {
        // Use CORS proxy for GitHub Pages
        return CONFIG.corsProxyUrl + encodeURIComponent(CONFIG.streamUrl);
    } else {
        // Use direct URL for local development
        return CONFIG.streamUrl;
    }
}

// Export the function
window.getStreamUrl = getStreamUrl;
