/**
 * WebXR Polyfill for DeshyEdge AR Experience
 * 
 * This script provides fallbacks and polyfills for WebXR features
 * to ensure the AR experience works across different browsers and devices.
 */

// Check if WebXR is natively supported
if (!('xr' in navigator)) {
    console.log('WebXR not natively supported, loading polyfill');
    
    // Load WebXR Polyfill
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js';
    script.async = true;
    
    script.onload = () => {
        // Initialize the WebXR polyfill after loading
        if (typeof WebXRPolyfill !== 'undefined') {
            const polyfill = new WebXRPolyfill();
            console.log('WebXR polyfill initialized');
        }
    };
    
    document.head.appendChild(script);
}

// Load Three.js and related libraries
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        // Load Three.js core
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js';
        threeScript.async = true;
        
        threeScript.onload = () => {
            console.log('Three.js loaded');
            
            // Load GLTFLoader
            const gltfLoaderScript = document.createElement('script');
            gltfLoaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/js/loaders/GLTFLoader.js';
            gltfLoaderScript.async = true;
            
            gltfLoaderScript.onload = () => {
                console.log('GLTFLoader loaded');
                resolve();
            };
            
            gltfLoaderScript.onerror = reject;
            document.head.appendChild(gltfLoaderScript);
        };
        
        threeScript.onerror = reject;
        document.head.appendChild(threeScript);
    });
}

// Initialize libraries when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadThreeJS()
        .then(() => {
            console.log('3D libraries loaded successfully');
        })
        .catch(error => {
            console.error('Error loading 3D libraries:', error);
        });
});