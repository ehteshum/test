const CONFIG = {
    // Primary stream URL
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    
    // CORS Proxies optimized for media streaming
    corsProxies: [
        "https://proxy.cors.sh/",
        "https://cors.streamlit.app/",
        "https://api.allorigins.win/raw?url="
    ]
};

// Function to determine if we're running on GitHub Pages or any remote server
function isGitHubPages() {
    return true; // Always use proxy to ensure it works
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    // Use the first proxy by default
    return CONFIG.corsProxies[0] + CONFIG.streamUrl;
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    if (currentIndex < CONFIG.corsProxies.length) {
        const nextProxy = CONFIG.corsProxies[currentIndex];
        console.log("Trying proxy:", nextProxy);
        return nextProxy + CONFIG.streamUrl;
    }
    // If we've tried all proxies, return the original URL as a last resort
    console.log("All proxies failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
