const CONFIG = {
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    corsProxies: [
        "https://api.allorigins.win/raw?url=",
        "https://api.codetabs.com/v1/proxy?quest=",
        "https://cors.streamlit.app/",
        "https://corsproxy.io/?"
    ]
};

// Function to determine if we're running on GitHub Pages or any remote server
function isGitHubPages() {
    // Check if running on localhost or 127.0.0.1
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '';
    
    // If not localhost, assume we need CORS proxy
    return !isLocalhost;
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    if (isGitHubPages()) {
        // Use the first CORS proxy by default
        return CONFIG.corsProxies[0] + encodeURIComponent(CONFIG.streamUrl);
    } else {
        // Use direct URL for local development
        return CONFIG.streamUrl;
    }
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    if (currentIndex < CONFIG.corsProxies.length - 1) {
        const nextProxy = CONFIG.corsProxies[currentIndex + 1];
        console.log("Trying alternative CORS proxy:", nextProxy);
        return nextProxy + encodeURIComponent(CONFIG.streamUrl);
    }
    // If we've tried all proxies, return the original URL as a last resort
    console.log("All CORS proxies failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
