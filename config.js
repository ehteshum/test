const CONFIG = {
    // Primary stream URL
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    
    // CORS Proxies optimized for media streaming
    corsProxies: [
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.org/?",
        "https://cors.eu.org/",
        "https://cors-proxy.org/",
        "https://api.codetabs.com/v1/proxy?quest="
    ]
};

// Function to determine if we're running on GitHub Pages or any remote server
function isGitHubPages() {
    return true; // Always use proxy to ensure it works
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    // Try HTTPS version first
    const httpsUrl = CONFIG.streamUrl.replace('http://', 'https://');
    return CONFIG.corsProxies[0] + encodeURIComponent(httpsUrl);
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    if (currentIndex < CONFIG.corsProxies.length) {
        const nextProxy = CONFIG.corsProxies[currentIndex];
        // Try both HTTP and HTTPS versions of the stream URL
        const urls = [
            CONFIG.streamUrl,
            CONFIG.streamUrl.replace('http://', 'https://')
        ];
        const url = urls[currentIndex % 2];
        console.log("Trying proxy:", nextProxy, "with URL:", url);
        return nextProxy + encodeURIComponent(url);
    }
    // If we've tried all proxies, return the original URL as a last resort
    console.log("All proxies failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
