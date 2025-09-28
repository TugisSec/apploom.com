// ===================================
// FAST-LOADING SAMPLE DESIGN MARKETPLACE
// ThemeWagon - Optimized JavaScript
// ===================================

'use strict';

// ===================================
// PERFORMANCE & UTILITY FUNCTIONS
// ===================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format time for video player
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: var(--background-card);
            color: var(--text-primary); padding: 12px 20px; border-radius: 8px;
            border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);
            z-index: 10000; opacity: 0; transform: translateY(-20px);
            transition: all 0.3s ease; font-size: 0.875rem; font-weight: 500; max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
};

// ===================================
// MOBILE MENU CONTROLLER
// ===================================
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.overlay = document.querySelector('.mobile-nav-overlay');
        this.hamburgerLines = document.querySelectorAll('.hamburger-line');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.toggle || !this.overlay) return;

        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.mobile-nav-link, .mobile-secondary-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    toggleMenu() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate hamburger to X
        this.hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        this.hamburgerLines[1].style.opacity = '0';
        this.hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';

        // Reset hamburger
        this.hamburgerLines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '';
        });
    }
}

// ===================================
// SEARCH CONTROLLER
// ===================================
class SearchController {
    constructor() {
        this.searchInput = document.querySelector('#searchInput');
        this.clearBtn = document.querySelector('#clearSearchBtn');
        this.templateCards = document.querySelectorAll('.template-card-link');
        this.templateGrid = document.querySelector('.template-grid');
        this.pageTitle = document.querySelector('#pageTitle');
        this.breadcrumb = document.querySelector('#breadcrumbCurrent');
        this.init();
    }

    init() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.trim();
            this.toggleClearButton(query);
            this.performSearch(query);
        }, 300));

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value.trim());
            }
        });

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearSearch());
        }
    }

    toggleClearButton(query) {
        if (this.clearBtn) {
            this.clearBtn.style.display = query ? 'flex' : 'none';
        }
    }

    performSearch(query) {
        const lowerQuery = query.toLowerCase();
        let visibleCount = 0;

        this.templateCards.forEach((cardLink, index) => {
            const card = cardLink.querySelector('.template-card');
            const title = card.querySelector('.template-title').textContent.toLowerCase();
            const type = card.querySelector('.template-type').textContent.toLowerCase();

            const isMatch = !query || title.includes(lowerQuery) || type.includes(lowerQuery);

            if (isMatch) {
                cardLink.style.display = 'block';
                this.animateCardIn(card, index * 50);
                visibleCount++;
            } else {
                this.animateCardOut(card, cardLink);
            }
        });

        this.handleNoResults(visibleCount, query);
        this.updateSearchResults(query, visibleCount);
    }

    animateCardIn(card, delay) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    }

    animateCardOut(card, cardLink) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => cardLink.style.display = 'none', 300);
    }

    handleNoResults(count, query) {
        const existing = document.querySelector('.no-results-message');
        if (existing) existing.remove();

        if (count === 0 && query) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results-message';
            noResults.style.cssText = `
                text-align: center; padding: 3rem 1rem; opacity: 0; transform: translateY(20px);
                transition: all 0.3s ease; background: var(--background-card); border-radius: var(--radius-xl);
                border: 1px solid var(--border-color); margin: 2rem 0;
            `;
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.5rem;">Unavailable</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">No sample designs found matching "${query}"</p>
                    <button onclick="window.app.components.searchController.clearSearch()" style="
                        background: var(--background-tertiary); color: var(--text-primary); border: 1px solid var(--border-color);
                        padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); cursor: pointer; font-size: 0.875rem;
                        transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem;
                    ">
                        <i class="fas fa-times"></i> Clear Search
                    </button>
                </div>
            `;
            this.templateGrid.parentNode.insertBefore(noResults, this.templateGrid.nextSibling);
            
            // Animate in
            setTimeout(() => {
                noResults.style.opacity = '1';
                noResults.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    updateSearchResults(query, count) {
        if (query) {
            this.pageTitle.textContent = `Results for: "${query}" (${count})`;
            this.breadcrumb.textContent = `Search: ${query}`;
        } else {
            this.pageTitle.textContent = 'All Sample Designs';
            this.breadcrumb.textContent = 'All Sample Designs';
        }
        
        // Reset mobile load more state when searching
        this.resetMobileLoadMore();
    }

    resetMobileLoadMore() {
        const templateGrid = document.querySelector('.template-grid');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (templateGrid && loadMoreBtn) {
            templateGrid.classList.remove('show-all');
            loadMoreBtn.classList.remove('show-less');
            loadMoreBtn.innerHTML = '<span>Load More Sample Designs</span><i class="fas fa-arrow-down"></i>';
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchInput.focus();
        this.toggleClearButton('');
        this.performSearch('');
        Utils.showNotification('Search cleared');
    }
}

// ===================================
// FILTER CONTROLLER
// ===================================
class FilterController {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilterDropdown();
    }

    setupFilterDropdown() {
        const filterBtn = document.querySelector('.filter-btn');
        const filterDropdown = document.querySelector('.filter-dropdown');
        const filterOptions = document.querySelectorAll('.filter-option');

        console.log('Setting up filter dropdown:', {
            btn: !!filterBtn,
            dropdown: !!filterDropdown,
            options: filterOptions.length
        });

        if (!filterBtn || !filterDropdown) {
            console.error('Filter elements not found');
            return;
        }

        // Toggle dropdown
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Filter button clicked');
            filterDropdown.classList.toggle('active');
        });

        // Handle filter options
        filterOptions.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const filterType = option.textContent.trim();
                console.log('Filter option clicked:', filterType);
                
                // Update button text
                const btnSpan = filterBtn.querySelector('span');
                if (btnSpan) btnSpan.textContent = filterType;
                
                // Close dropdown
                filterDropdown.classList.remove('active');
                
                // Apply filter
                this.applyFilter(filterType);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                filterDropdown.classList.remove('active');
            }
        });
    }

    applyFilter(filterType) {
        console.log('Applying filter:', filterType);
        const templateCards = document.querySelectorAll('.template-card-link');
        let visibleCount = 0;

        templateCards.forEach((cardLink) => {
            const typeElement = cardLink.querySelector('.template-type');
            const cardType = typeElement ? typeElement.textContent.trim() : '';
            
            let shouldShow = filterType === 'All Types' || 
                           (filterType === 'Sample Designs' && cardType === 'Sample Design') ||
                           (filterType === 'Components' && cardType === 'Component') ||
                           (filterType === 'Plugins' && cardType === 'Plugin');

            if (shouldShow) {
                cardLink.style.display = 'block';
                visibleCount++;
            } else {
                cardLink.style.display = 'none';
            }
        });

        console.log('Filter applied, visible cards:', visibleCount);
        
        // Update page title
        const pageTitle = document.querySelector('#pageTitle');
        if (pageTitle) {
            pageTitle.textContent = filterType === 'All Types' ? 'All Sample Designs' : `${filterType} (${visibleCount})`;
        }
    }
}

// ===================================
// VIDEO PLAYER CONTROLLER
// ===================================
class VideoPlayer {
    constructor() {
        this.video = document.getElementById('aboutVideo');
        this.overlay = document.getElementById('videoOverlay');
        this.playButton = document.getElementById('playButton');
        this.controls = document.getElementById('videoControls');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.isPlaying = false;
        this.controlsTimeout = null;
        this.init();
    }

    init() {
        if (!this.video || !this.overlay || !this.playButton) return;

        this.playButton.addEventListener('click', () => this.play());
        this.video.addEventListener('click', () => this.toggle());
        
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => this.seek(e));
        }

        this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });
        this.video.addEventListener('ended', () => this.reset());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());

        this.setupKeyboardControls();
        this.setupMouseControls();
    }

    play() {
        this.video.play().then(() => {
            this.isPlaying = true;
            this.overlay.classList.add('hidden');
            Utils.showNotification('Video playing');
        }).catch(error => {
            console.error('Error playing video:', error);
            Utils.showNotification('Error playing video');
        });
    }

    pause() {
        this.video.pause();
        this.isPlaying = false;
        Utils.showNotification('Video paused');
    }

    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.video.currentTime = percentage * this.video.duration;
    }

    onPlay() {
        this.isPlaying = true;
        this.overlay.classList.add('hidden');
        if (this.controls) {
            this.controls.classList.add('visible');
            this.showControlsTemporarily();
        }
    }

    onPause() {
        this.isPlaying = false;
        if (this.controls) this.controls.classList.remove('visible');
    }

    reset() {
        this.isPlaying = false;
        this.video.currentTime = 0;
        this.overlay.classList.remove('hidden');
        if (this.controls) this.controls.classList.remove('visible');
        this.updateProgress();
        this.updateTimeDisplay();
    }

    updateProgress() {
        if (this.video.duration && this.progressFill) {
            const percentage = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = percentage + '%';
        }
    }

    updateTimeDisplay() {
        if (this.timeDisplay && this.video.duration) {
            const current = Utils.formatTime(this.video.currentTime);
            const total = Utils.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'ArrowLeft':
                    if (this.isPlaying) {
                        e.preventDefault();
                        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                    }
                    break;
                case 'ArrowRight':
                    if (this.isPlaying) {
                        e.preventDefault();
                        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                    }
                    break;
            }
        });
    }

    setupMouseControls() {
        const videoContainer = document.querySelector('.about-video');
        if (!videoContainer) return;

        videoContainer.addEventListener('mousemove', () => {
            if (this.isPlaying && this.controls) {
                this.controls.classList.add('visible');
                this.showControlsTemporarily();
            }
        });

        videoContainer.addEventListener('mouseleave', () => {
            if (this.isPlaying && this.controls) {
                clearTimeout(this.controlsTimeout);
                this.controlsTimeout = setTimeout(() => {
                    this.controls.classList.remove('visible');
                }, 1000);
            }
        });
    }

    showControlsTemporarily() {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            if (this.isPlaying && this.controls) {
                this.controls.classList.remove('visible');
            }
        }, 3000);
    }
}

// ===================================
// NAVIGATION CONTROLLER
// ===================================
class NavigationController {
    constructor() {
        this.secondaryNavLinks = document.querySelectorAll('.secondary-nav-link, .mobile-secondary-link');
        this.sections = document.querySelectorAll('#templates, #about, #contact');
        this.init();
    }

    init() {
        this.secondaryNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link);
            });
        });

        window.addEventListener('scroll', Utils.throttle(() => this.updateActiveNavigation(), 100));
    }

    navigateToSection(clickedLink) {
        const targetId = clickedLink.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (!targetSection) return;

        // Update active states
        this.secondaryNavLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
        
        const correspondingLink = document.querySelector(
            clickedLink.classList.contains('secondary-nav-link') 
                ? `.mobile-secondary-link[href="${targetId}"]`
                : `.secondary-nav-link[href="${targetId}"]`
        );
        if (correspondingLink) correspondingLink.classList.add('active');

        // Smooth scroll
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (app && app.components.mobileMenu) {
            app.components.mobileMenu.close();
        }
    }

    updateActiveNavigation() {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;
        let activeSection = 'templates';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section.id;
            }
        });

        this.secondaryNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${activeSection}`);
        });
    }
}

// ===================================
// CONTACT ANIMATION CONTROLLER
// ===================================
class ContactAnimation {
    constructor() {
        this.contactBtn = document.querySelector('.contact-btn');
        this.init();
    }

    init() {
        if (!this.contactBtn) return;

        // Shake animation every 3 seconds
        setInterval(() => {
            this.contactBtn.classList.add('shake');
            setTimeout(() => this.contactBtn.classList.remove('shake'), 600);
        }, 3000);

        // Stop shaking on interaction
        this.contactBtn.addEventListener('mouseenter', () => {
            this.contactBtn.classList.remove('shake');
        });

        this.contactBtn.addEventListener('click', () => {
            this.contactBtn.classList.remove('shake');
        });
    }
}

// ===================================
// LAZY LOADING CONTROLLER
// ===================================
class LazyLoader {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) return;

        this.setupImageLazyLoading();
        this.setupVideoLazyLoading();
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.addEventListener('load', () => img.style.opacity = '1');
                    observer.unobserve(img);
                }
            });
        }, this.observerOptions);

        images.forEach(img => imageObserver.observe(img));
    }

    setupVideoLazyLoading() {
        const video = document.getElementById('aboutVideo');
        if (!video) return;

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.preload = 'metadata';
                    videoObserver.unobserve(video);
                }
            });
        }, this.observerOptions);

        videoObserver.observe(video);
    }
}

// ===================================
// LOAD MORE CONTROLLER
// ===================================
class LoadMoreController {
    constructor() {
        this.isShowingAll = false;
        this.init();
    }

    init() {
        this.setupLoadMore();
    }

    setupLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const templateGrid = document.querySelector('.template-grid');

        console.log('Setting up load more:', {
            btn: !!loadMoreBtn,
            grid: !!templateGrid
        });

        if (!loadMoreBtn || !templateGrid) {
            console.error('Load more elements not found');
            return;
        }

        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Load more button clicked, current state:', this.isShowingAll);
            
            if (this.isShowingAll) {
                this.showLess(templateGrid, loadMoreBtn);
            } else {
                this.showMore(templateGrid, loadMoreBtn);
            }
        });
    }

    showMore(templateGrid, loadMoreBtn) {
        console.log('Showing more templates');
        this.isShowingAll = true;
        
        // Add class to show all templates
        templateGrid.classList.add('show-all');
        
        // Update button
        loadMoreBtn.innerHTML = '<span>Show Less</span><i class="fas fa-arrow-up"></i>';
        
        console.log('Templates should now be visible');
    }

    showLess(templateGrid, loadMoreBtn) {
        console.log('Showing less templates');
        this.isShowingAll = false;
        
        // Remove class to hide templates 7-12
        templateGrid.classList.remove('show-all');
        
        // Update button
        loadMoreBtn.innerHTML = '<span>Load More Sample Designs</span><i class="fas fa-arrow-down"></i>';
        
        // Scroll to top of template grid
        templateGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('Templates 7-12 should now be hidden');
    }
}

// ===================================
// AOS ANIMATION CONTROLLER
// ===================================
class AOSController {
    constructor() {
        this.init();
    }

    init() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 0,
            });
        } else {
            this.fallbackAnimation();
        }
    }

    fallbackAnimation() {
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// ===================================
// SCROLL EFFECTS CONTROLLER
// ===================================
class ScrollEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.header) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.header.style.background = 'rgba(0, 0, 0, 0.95)';
                this.header.style.backdropFilter = 'blur(20px)';
            } else {
                this.header.style.background = 'var(--background-primary)';
                this.header.style.backdropFilter = 'blur(10px)';
            }
        }, 16));

        // Smooth scroll for anchor links
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
}

// ===================================
// MAIN APPLICATION CONTROLLER
// ===================================
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Fallback for browsers without requestIdleCallback
        if (!window.requestIdleCallback) {
            window.requestIdleCallback = function(cb) {
                return setTimeout(cb, 1);
            };
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Initialize critical components first for fast loading
            this.initializeCriticalComponents();
            
            // Initialize non-critical components with delay for better performance
            requestIdleCallback(() => {
                this.initializeNonCriticalComponents();
            });
        });
    }

    initializeCriticalComponents() {
        // Initialize preloader first
        this.components.preloaderController = new PreloaderController();
        
        // Critical for immediate user interaction
        this.components.mobileMenu = new MobileMenu();
        this.components.searchController = new SearchController();
        this.components.filterController = new FilterController();
        this.components.loadMoreController = new LoadMoreController();
        
        // Make search controller globally accessible
        window.searchController = this.components.searchController;
        
        console.log('Critical components initialized');
    }

    initializeNonCriticalComponents() {
        // Non-critical components loaded after page interaction
        this.components.videoPlayer = new VideoPlayer();
        this.components.navigationController = new NavigationController();
        this.components.contactAnimation = new ContactAnimation();
        this.components.lazyLoader = new LazyLoader();
        this.components.aosController = new AOSController();
        this.components.scrollEffects = new ScrollEffects();
        
        this.setupTemplateCards();
        this.setupErrorHandling();
        
        console.log('Non-critical components initialized');
    }

    setupTemplateCards() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.preview-btn')) {
                    this.handleTemplateClick(card);
                }
            });

            const previewBtn = card.querySelector('.preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handlePreviewClick(card);
                });
            }

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTemplateClick(card);
                }
            });

            // Image error handling
            const img = card.querySelector('.template-image img');
            if (img) {
                img.addEventListener('error', () => {
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTExMTExIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjNzE3MTdhIi8+PC9zdmc+';
                });
            }
        });
    }

    handleTemplateClick(card) {
        const title = card.querySelector('.template-title').textContent;
        
        card.style.transform = 'scale(0.98)';
        setTimeout(() => card.style.transform = '', 150);
        
        Utils.showNotification(`Opening ${title} sample design...`);
    }

    handlePreviewClick(card) {
        const title = card.querySelector('.template-title').textContent;
        
        const previewBtn = card.querySelector('.preview-btn');
        previewBtn.style.transform = 'scale(0.95)';
        setTimeout(() => previewBtn.style.transform = '', 150);
        
        Utils.showNotification(`Loading preview for ${title}...`);
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
}

// ===================================
// NEWSLETTER FUNCTIONALITY
// ===================================
class NewsletterController {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.input = document.querySelector('.newsletter-input');
        this.button = document.querySelector('.newsletter-btn');
        this.buttonText = this.button?.querySelector('span');
        this.buttonIcon = this.button?.querySelector('i');
        this.init();
    }

    init() {
        if (!this.form || !this.input || !this.button) return;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.input.addEventListener('input', () => this.validateInput());
        
        // Focus effects
        this.input.addEventListener('focus', () => this.input.parentElement.classList.add('focused'));
        this.input.addEventListener('blur', () => this.input.parentElement.classList.remove('focused'));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input.value.trim();
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            this.input.focus();
            return;
        }
        
        this.setButtonLoading(true);
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
                this.form.reset();
                if (typeof Utils !== 'undefined' && Utils.showNotification) {
                    Utils.showNotification('Newsletter subscription successful!');
                }
            } else {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    throw new Error(errorMessages.join(', '));
                } else {
                    throw new Error(data.error || 'Subscription failed');
                }
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            
            let errorMessage = 'Something went wrong. Please try again later.';
            if (error.message.includes('email')) {
                errorMessage = 'Please check your email address and try again.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.setButtonLoading(false);
        }
    }

    validateInput() {
        const email = this.input.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.input.style.borderColor = '#ef4444';
            this.input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
        } else {
            this.input.style.borderColor = '';
            this.input.style.boxShadow = '';
        }
    }

    setButtonLoading(loading) {
        if (loading) {
            this.button.disabled = true;
            if (this.buttonText) this.buttonText.textContent = 'Subscribing...';
            if (this.buttonIcon) this.buttonIcon.className = 'fas fa-spinner fa-spin';
            this.button.style.opacity = '0.7';
        } else {
            this.button.disabled = false;
            if (this.buttonText) this.buttonText.textContent = 'Subscribe';
            if (this.buttonIcon) this.buttonIcon.className = 'fas fa-paper-plane';
            this.button.style.opacity = '1';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.newsletter-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `newsletter-notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'background: linear-gradient(135deg, #10b981, #059669);',
            error: 'background: linear-gradient(135deg, #ef4444, #dc2626);',
            info: 'background: linear-gradient(135deg, #3b82f6, #2563eb);'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            font-size: 14px;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            ${colors[type] || colors.info}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// ===================================
// PRELOADER CONTROLLER
// ===================================
class PreloaderController {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 1000;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (!this.preloader) return;

        this.show();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handlePageLoad();
            });
        } else {
            this.handlePageLoad();
        }

        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
    }

    show() {
        if (this.preloader) {
            this.preloader.classList.remove('fade-out');
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (!this.preloader) return;

        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

        setTimeout(() => {
            this.preloader.classList.add('fade-out');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.parentNode.removeChild(this.preloader);
                }
            }, 500);
        }, remainingTime);
    }

    handlePageLoad() {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }
            });
        });

        Promise.all(imagePromises).then(() => {
            this.hide();
        });

        setTimeout(() => {
            this.hide();
        }, 5000);
    }
}

// ===================================
// GLOBAL INSTANCES & INITIALIZATION
// ===================================
let app;
let newsletter;

// Initialize the application
app = new App();
newsletter = new NewsletterController();

// ===================================
// THEME DETECTION
// ===================================
function detectColorScheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);
}

detectColorScheme();

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// PERFORMANCE MONITORING
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

// ===================================
// EXPORT FOR GLOBAL ACCESS
// ===================================
window.app = app;
window.Utils = Utils;
