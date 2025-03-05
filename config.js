const CONFIG = {
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    corsProxies: [
        "https://proxy.cors.sh/",
        "https://cors-proxy.htmldriven.com/?url=",
        "https://crossorigin.me/",
        "https://thingproxy.freeboard.io/fetch/",
        "https://yacdn.org/proxy/"
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
        // Try each proxy in sequence until one works
        return CONFIG.corsProxies[0] + CONFIG.streamUrl;
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
        return nextProxy + CONFIG.streamUrl;
    }
    // If we've tried all proxies, return the original URL as a last resort
    console.log("All CORS proxies failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
