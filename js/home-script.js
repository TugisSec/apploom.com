// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollEffects();
    initParallaxEffect();
    initCounterAnimation();
    initFloatingElements();
    initSmoothScrolling();
    initButtonEffects();
    initNewsletterForm();
});

// Scroll Effects
function initScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const featuresSection = document.querySelector('.features-section');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        // Hide scroll indicator when scrolling
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
    });
    
    // Scroll indicator click
    scrollIndicator.addEventListener('click', function() {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// Parallax Effect for Background
function initParallaxEffect() {
    const heroContainer = document.querySelector('.hero-container');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < window.innerHeight) {
            heroContainer.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Counter Animation
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        animated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const suffix = stat.textContent.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 20);
        });
    };
    
    // Trigger animation when hero section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
            }
        });
    });
    
    observer.observe(document.querySelector('.hero-stats'));
}

// Enhanced Floating Elements
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Random initial position adjustments
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        element.style.left = randomX + '%';
        element.style.top = randomY + '%';
        
        // Add mouse interaction
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // Mouse movement effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Button Effects and Interactions
function initButtonEffects() {
    const exploreBtn = document.querySelector('.explore-btn');
    
    // Add ripple effect
    exploreBtn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .explore-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Feature Cards Animation on Scroll
function initFeatureCardsAnimation() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize feature cards animation
initFeatureCardsAnimation();

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Space or Enter to trigger explore button
    if ((e.code === 'Space' || e.code === 'Enter') && e.target === document.body) {
        e.preventDefault();
        document.querySelector('.explore-btn').click();
    }
    
    // Arrow down to scroll to features
    if (e.code === 'ArrowDown' && e.target === document.body) {
        e.preventDefault();
        document.querySelector('.features-section').scrollIntoView({
            behavior: 'smooth'
        });
    }
});

// Performance Optimization - Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    // Scroll-based animations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Loading Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Resize Handler
window.addEventListener('resize', function() {
    // Recalculate positions for floating elements on resize
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(element => {
        element.style.transform = 'translate(0, 0)';
    });
});

// Add some interactive particles effect
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
    `;
    
    document.querySelector('.hero-container').appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${2 + Math.random() * 3}s infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add twinkle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Initialize particles
createParticles();

// Analytics tracking (demo)
function trackEvent(eventName, eventData) {
    console.log(`Analytics Event: ${eventName}`, eventData);
}

// Track button clicks
document.querySelector('.explore-btn').addEventListener('click', function() {
    trackEvent('explore_button_click', { 
        timestamp: new Date().toISOString(),
        page: 'home'
    });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});


const preloader = document.getElementById("preloader");

  // Hide after page load
  window.addEventListener("load", () => {
    preloader.classList.add("is-hidden");
    setTimeout(() => preloader.style.display = "none", 450);
  });

  // Show again on link click (internal navigation only)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const sameHost = a.host === location.host;
    const newTab = a.target === "_blank";
    const anchor = a.getAttribute("href").startsWith("#");

    if (sameHost && !newTab && !anchor) {
      preloader.style.display = "flex";
      preloader.classList.remove("is-hidden");
    }
  });

  // Show again on refresh/close
  window.addEventListener("beforeunload", () => {
    preloader.style.display = "flex";
    preloader.classList.remove("is-hidden");
  });