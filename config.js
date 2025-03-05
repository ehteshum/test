const CONFIG = {
    // Primary stream URL
    streamUrl: "http://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
    
    // Backup stream URLs (using different protocols)
    backupStreamUrls: [
        "https://kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8",
        "//kst.moonplex.net:8080/CH2/tracks-v1a1/mono.m3u8"
    ],
    
    // CORS Proxies optimized for media streaming
    corsProxies: [
        "https://api.allorigins.win/raw?url=",
        "https://api.codetabs.com/v1/proxy/?quest=",
        "https://bypass-cors.vercel.app/api?url=",
        "https://cors-anywhere-c1ph.onrender.com/",
        "https://cors-anywhere-production-0983.up.railway.app/"
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

// Function to get all possible stream URLs
function getAllStreamUrls() {
    const urls = [CONFIG.streamUrl, ...CONFIG.backupStreamUrls];
    if (isGitHubPages()) {
        // Add proxied versions of all URLs
        const proxiedUrls = [];
        urls.forEach(url => {
            CONFIG.corsProxies.forEach(proxy => {
                proxiedUrls.push(proxy + encodeURIComponent(url));
            });
        });
        return [...proxiedUrls, ...urls]; // Include direct URLs as fallback
    }
    return urls;
}

// Function to get the appropriate stream URL based on environment
function getStreamUrl() {
    if (isGitHubPages()) {
        // Start with the first proxied URL
        return CONFIG.corsProxies[0] + encodeURIComponent(CONFIG.streamUrl);
    } else {
        // Use direct URL for local development
        return CONFIG.streamUrl;
    }
}

// Function to try alternative CORS proxies
function tryAlternativeProxy(currentIndex) {
    const allUrls = getAllStreamUrls();
    if (currentIndex < allUrls.length - 1) {
        const nextUrl = allUrls[currentIndex + 1];
        console.log("Trying alternative URL:", nextUrl);
        return nextUrl;
    }
    // If we've tried all URLs, return the original URL as a last resort
    console.log("All URLs failed, trying direct URL");
    return CONFIG.streamUrl;
}

// Export the functions
window.getStreamUrl = getStreamUrl;
window.tryAlternativeProxy = tryAlternativeProxy;
window.getAllStreamUrls = getAllStreamUrls;
