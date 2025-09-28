// Video Pause/Play Control Enhancement
// Adds pause/play toggle functionality to the video controls

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('aboutVideo');
    const pauseButton = document.getElementById('pauseButton');
    
    if (!video || !pauseButton) {
        console.warn('Video or pause button not found');
        return;
    }
    
    // Initialize pause button state
    function updatePauseButtonIcon() {
        const icon = pauseButton.querySelector('i');
        if (!icon) return;
        
        if (video.paused) {
            // Show play icon when paused
            icon.className = 'fas fa-play';
            pauseButton.setAttribute('aria-label', 'Play video');
            pauseButton.setAttribute('title', 'Play');
        } else {
            // Show pause icon when playing
            icon.className = 'fas fa-pause';
            pauseButton.setAttribute('aria-label', 'Pause video');
            pauseButton.setAttribute('title', 'Pause');
        }
    }
    
    // Toggle play/pause functionality
    function togglePlayPause() {
        if (video.paused) {
            video.play().then(() => {
                updatePauseButtonIcon();
                // Hide overlay when playing
                const overlay = document.getElementById('videoOverlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                }
            }).catch(error => {
                console.error('Error playing video:', error);
            });
        } else {
            video.pause();
            updatePauseButtonIcon();
        }
    }
    
    // Add click event listener to pause button
    pauseButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        togglePlayPause();
    });
    
    // Update icon when video state changes
    video.addEventListener('play', updatePauseButtonIcon);
    video.addEventListener('pause', updatePauseButtonIcon);
    video.addEventListener('ended', function() {
        updatePauseButtonIcon();
        // Show overlay when video ends
        const overlay = document.getElementById('videoOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    });
    
    // Initialize the button state
    updatePauseButtonIcon();
    
    // Add keyboard support (spacebar to toggle)
    document.addEventListener('keydown', function(e) {
        // Only trigger if not typing in an input field
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
            return;
        }
        
        if (e.code === 'Space' && !video.paused) {
            e.preventDefault();
            togglePlayPause();
        }
    });
});
