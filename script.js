const videoPlayer = document.getElementById('videoPlayer');
const loadingOverlay = document.querySelector('.loading-overlay');
const errorOverlay = document.querySelector('.error-overlay');
let hls = null;
let currentProxyIndex = 0;

function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showError(show, message = 'Stream error occurred') {
    errorOverlay.style.display = show ? 'flex' : 'none';
    errorOverlay.querySelector('.error-message').textContent = message;
}

function loadStream(useNextProxy = false) {
    if (useNextProxy) {
        currentProxyIndex++;
    }
    
    let streamUrl = useNextProxy ? 
        window.tryAlternativeProxy(currentProxyIndex - 1) : 
        window.getStreamUrl();
    
    if (!streamUrl) return;

    showError(false);
    showLoading(true);

    if (hls) {
        hls.destroy();
        hls = null;
    }

    if (Hls.isSupported()) {
        const hlsConfig = {
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 60,
            maxBufferLength: 30,
            manifestLoadingTimeOut: 15000,
            manifestLoadingMaxRetry: 4,
            manifestLoadingRetryDelay: 1000,
            levelLoadingTimeOut: 15000,
            levelLoadingMaxRetry: 4,
            levelLoadingRetryDelay: 1000,
            fragLoadingTimeOut: 15000,
            fragLoadingMaxRetry: 4,
            fragLoadingRetryDelay: 1000,
            startLevel: -1,
            testBandwidth: true,
            progressive: true,
            xhrSetup: function(xhr, url) {
                // Add additional headers if needed
                xhr.withCredentials = false; // Important for CORS
            }
        };

        hls = new Hls(hlsConfig);

        hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Network error:', data);
                        if (currentProxyIndex < CONFIG.corsProxies.length) {
                            showError(true, 'Network error occurred. Trying alternative source...');
                            setTimeout(() => loadStream(true), 2000);
                        } else {
                            showError(true, 'Network error occurred. Please try again later.');
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        showError(true, 'Media error occurred. Recovering...');
                        hls.recoverMediaError();
                        break;
                    default:
                        if (currentProxyIndex < CONFIG.corsProxies.length) {
                            showError(true, 'Error occurred. Trying alternative source...');
                            setTimeout(() => loadStream(true), 2000);
                        } else {
                            showError(true, 'Fatal error occurred. Please try again later.');
                        }
                        break;
                }
            }
        });

        hls.on(Hls.Events.MANIFEST_LOADING, () => {
            showLoading(true);
            showError(false);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            showLoading(false);
            playVideo();
        });

        try {
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                console.log('Loading stream from URL:', streamUrl);
                hls.loadSource(streamUrl);
            });
        } catch (error) {
            console.error('HLS initialization error:', error);
            if (currentProxyIndex < CONFIG.corsProxies.length) {
                showError(true, 'Failed to initialize player. Trying alternative source...');
                setTimeout(() => loadStream(true), 2000);
            } else {
                showError(true, 'Failed to initialize player. Please try again later.');
            }
        }
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = streamUrl;
        videoPlayer.addEventListener('loadedmetadata', playVideo);
        videoPlayer.addEventListener('error', () => {
            if (currentProxyIndex < CONFIG.corsProxies.length) {
                showError(true, 'Video error occurred. Trying alternative source...');
                setTimeout(() => loadStream(true), 2000);
            } else {
                showError(true, 'Video error occurred. Please try again later.');
            }
        });
    } else {
        showError(true, 'Your browser does not support HLS playback.');
    }
}

function playVideo() {
    try {
        if (videoPlayer.paused) {
            videoPlayer.play().catch(() => {
                videoPlayer.muted = true;
                videoPlayer.play();
            });
        }
    } catch (error) {
        console.error('Playback error:', error);
        showError(true, 'Playback error occurred.');
    }
}

videoPlayer.addEventListener('error', () => {
    console.error('Video element error:', videoPlayer.error);
    if (currentProxyIndex < CONFIG.corsProxies.length) {
        showError(true, 'Video playback error. Trying alternative source...');
        setTimeout(() => loadStream(true), 2000);
    } else {
        showError(true, 'Video playback error. Please try again later.');
    }
});

videoPlayer.addEventListener('stalled', () => {
    showLoading(true);
    setTimeout(() => {
        if (videoPlayer.readyState < 3) {
            if (currentProxyIndex < CONFIG.corsProxies.length) {
                loadStream(true);
            } else {
                loadStream();
            }
        }
    }, 5000);
});

videoPlayer.addEventListener('playing', () => {
    showLoading(false);
    showError(false);
});

videoPlayer.addEventListener('waiting', () => showLoading(true));
videoPlayer.addEventListener('canplay', () => showLoading(false));

// Add a retry button event listener
document.querySelector('.retry-button').addEventListener('click', () => {
    currentProxyIndex = 0; // Reset proxy index on manual retry
    loadStream();
});

document.addEventListener('DOMContentLoaded', loadStream);
