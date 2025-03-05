const CONFIG = {
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    corsProxies: [
        "https://corsproxy.io/?",
        "https://cors-anywhere.herokuapp.com/",
        "https://api.allorigins.win/raw?url="
    ]
};

// Function to determine if we're running on GitHub Pages
function isGitHubPages() {
    return window.location.hostname.includes('github.io') || 
           window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
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
