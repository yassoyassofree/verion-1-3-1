// Initialize PWA
let deferredPrompt;

// Check if PWA is installed
const isInstalled = () => {
  return navigator.standalone || (window.matchMedia('(display-mode: standalone)').matches);
};

// Show install button if available
const showInstallButton = () => {
  const installButton = document.querySelector('.install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      try {
        if (!deferredPrompt) {
          console.error('No deferred prompt available');
          return;
        }
        
        // Show the prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the installation');
          // Hide the button after successful installation
          installButton.style.display = 'none';
          
          // Send message to service worker to cache
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage('log-cache');
          }
        } else {
          console.log('User dismissed the installation');
        }
        
        // Reset the deferred prompt
        deferredPrompt = null;
      } catch (error) {
        console.error('Installation error:', error);
      }
    });
  }
};

// Initialize PWA
if ('serviceWorker' in navigator) {
  // Register service worker
  navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
      
      // Listen for installation prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Only show install button if not installed
        if (!isInstalled()) {
          showInstallButton();
        }
      });
      
      // Listen for app installation
      window.addEventListener('appinstalled', () => {
        console.log('App was installed');
        // Hide the install button after installation
        const installButton = document.querySelector('.install-button');
        if (installButton) {
          installButton.style.display = 'none';
        }
      });
      
      // Listen for service worker state changes
      registration.installing?.addEventListener('statechange', event => {
        console.log('Service Worker state:', event.target.state);
      });
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
} else {
  console.log('Service Worker not supported');
}

// Check if PWA is supported
if (!('serviceWorker' in navigator)) {
  console.log('PWA not supported');
} else {
  console.log('PWA supported');
}
