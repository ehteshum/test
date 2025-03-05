const CONFIG = {
    // Primary stream URL with multiple fallbacks
    streamUrls: [
        "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
        "https://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
        "http://kst.moonplex.net:8080/CH2/index.m3u8",
        "https://kst.moonplex.net:8080/CH2/index.m3u8"
    ],
    
    // CORS Proxies optimized for media streaming
    corsProxies: [
        "https://cors.streamlit.app/",
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://api.codetabs.com/v1/proxy?quest=",
        "https://cors-proxy.org/",
        "https://crossorigin.me/"
    ]
};

// Function to determine if we're running on GitHub Pages or any remote server
function isGitHubPages() {
    return true; // Always use proxy to ensure it works
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    const urlIndex = parseInt(localStorage.getItem('lastWorkingUrlIndex') || '0');
    const proxyIndex = parseInt(localStorage.getItem('lastWorkingProxyIndex') || '0');
    
    // Get the stream URL and proxy
    const streamUrl = CONFIG.streamUrls[urlIndex] || CONFIG.streamUrls[0];
    const proxy = CONFIG.corsProxies[proxyIndex] || CONFIG.corsProxies[0];
    
    return proxy + encodeURIComponent(streamUrl);
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    if (currentIndex < CONFIG.corsProxies.length * CONFIG.streamUrls.length) {
        const proxyIndex = Math.floor(currentIndex / CONFIG.streamUrls.length);
        const urlIndex = currentIndex % CONFIG.streamUrls.length;
        
        const proxy = CONFIG.corsProxies[proxyIndex];
        const streamUrl = CONFIG.streamUrls[urlIndex];
        
        // Store the indices if they worked
        if (currentIndex > 0) {
            localStorage.setItem('lastWorkingProxyIndex', proxyIndex.toString());
            localStorage.setItem('lastWorkingUrlIndex', urlIndex.toString());
        }
        
        console.log("Trying proxy:", proxy, "with URL:", streamUrl);
        return proxy + encodeURIComponent(streamUrl);
    }
    
    // If all combinations fail, try direct URLs in sequence
    const directUrlIndex = Math.min(
        Math.floor((currentIndex - (CONFIG.corsProxies.length * CONFIG.streamUrls.length)) / 2),
        CONFIG.streamUrls.length - 1
    );
    
    console.log("All proxies failed, trying direct URL:", CONFIG.streamUrls[directUrlIndex]);
    return CONFIG.streamUrls[directUrlIndex];
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
