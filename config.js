const CONFIG = {
    // Primary stream URL
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    
    // CORS Proxies optimized for media streaming
    corsProxies: [
        "https://proxy.cors.sh/",
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://cors-anywhere.herokuapp.com/",
        "https://cors.streamlit.app/",
        "https://api.codetabs.com/v1/proxy?quest="
    ]
};

// Function to determine if we're running on GitHub Pages or any remote server
function isGitHubPages() {
    return true; // Always use proxy to ensure it works
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    // Try each proxy in sequence
    const proxyIndex = localStorage.getItem('lastWorkingProxyIndex') || 0;
    const proxy = CONFIG.corsProxies[proxyIndex];
    
    // Try HTTPS version first, then HTTP if HTTPS fails
    const httpsUrl = CONFIG.streamUrl.replace('http://', 'https://');
    return proxy + encodeURIComponent(httpsUrl);
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    if (currentIndex < CONFIG.corsProxies.length) {
        const nextProxy = CONFIG.corsProxies[currentIndex];
        
        // Try both HTTP and HTTPS versions
        const urls = [
            CONFIG.streamUrl.replace('http://', 'https://'),  // Try HTTPS first
            CONFIG.streamUrl  // Fallback to HTTP
        ];
        
        // Alternate between HTTPS and HTTP versions
        const url = urls[currentIndex % 2];
        
        // Store the last working proxy index
        if (currentIndex > 0) {
            localStorage.setItem('lastWorkingProxyIndex', (currentIndex - 1).toString());
        }
        
        console.log("Trying proxy:", nextProxy, "with URL:", url);
        return nextProxy + encodeURIComponent(url);
    }
    
    // If all proxies fail, try direct URL as last resort
    console.log("All proxies failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
