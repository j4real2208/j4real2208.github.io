document.addEventListener('DOMContentLoaded', () => {
    // Reduced motion preference (re-evaluated on change)
    const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionMQ.matches;
    reducedMotionMQ.addEventListener('change', (e) => {
        prefersReducedMotion = e.matches;
        // Start/stop testimonial auto-advance in response to preference changes
        if (testimonialCards && testimonialCards.length > 0) {
            clearInterval(testimonialInterval);
            if (!prefersReducedMotion) {
                startTestimonialTimer();
            }
        }
    });

    // Preloader
    const preloader = document.querySelector('.preloader');

    // Hide preloader after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 500);
    });

    // Update current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const setMenuExpanded = (open) => {
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const willOpen = !navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            setMenuExpanded(willOpen);
        });
    }

    // Close mobile menu on Escape (when open)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            setMenuExpanded(false);
            if (menuToggle) menuToggle.focus();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    setMenuExpanded(false);
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed header
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            scrollToTopBtn.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            scrollToTopBtn.classList.remove('active');
        }

        if (scrollProgressBar) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
            scrollProgressBar.style.width = scrollPercent + '%';
        }
    });

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const syncFilterAria = (activeBtn) => {
        filterBtns.forEach(b => {
            b.setAttribute('aria-pressed', b === activeBtn ? 'true' : 'false');
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            syncFilterAria(btn);

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialize filter aria-pressed based on current active button
    const initialActiveFilter = document.querySelector('.filter-btn.active') || filterBtns[0];
    if (initialActiveFilter) syncFilterAria(initialActiveFilter);

    // Contact form submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // This will handle form submission when Formspree redirects back to your site
        if (window.location.search.includes('submitted=true')) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.setAttribute('role', 'status');
            successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
            successMessage.style.padding = '15px';
            successMessage.style.marginTop = '20px';
            successMessage.style.backgroundColor = '#d4edda';
            successMessage.style.borderRadius = '5px';
            successMessage.style.color = '#155724';

            contactForm.parentNode.insertBefore(successMessage, contactForm);

            // Remove the message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }

        contactForm.addEventListener('submit', (e) => {
            // Let Formspree handle the form submission
            // No need to prevent default

            // Show loading indicator
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');

            // If form submission fails, restore button
            setTimeout(() => {
                if (document.activeElement === submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');

                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.setAttribute('role', 'alert');
                    errorMessage.textContent = 'Something went wrong. Please try again or email me directly.';
                    errorMessage.style.padding = '15px';
                    errorMessage.style.marginTop = '20px';
                    errorMessage.style.backgroundColor = '#f8d7da';
                    errorMessage.style.borderRadius = '5px';
                    errorMessage.style.color = '#721c24';

                    contactForm.parentNode.insertBefore(errorMessage, contactForm);
                    setTimeout(() => errorMessage.remove(), 5000);
                }
            }, 3000);
        });
    }

    // Dynamic text animation in hero section
    const dynamicTexts = document.querySelectorAll('.dynamic-text');
    let currentTextIndex = 0;

    function animateDynamicText() {
        // Hide current text
        dynamicTexts[currentTextIndex].classList.remove('visible');

        // Move to next text
        currentTextIndex = (currentTextIndex + 1) % dynamicTexts.length;

        // Show next text
        dynamicTexts[currentTextIndex].classList.add('visible');
    }

    // Set first text as visible
    if (dynamicTexts.length > 0) {
        dynamicTexts[0].classList.add('visible');
    }

    // Change text every 3 seconds (unless reduced motion preferred)
    if (!prefersReducedMotion && dynamicTexts.length > 1) {
        setInterval(animateDynamicText, 3000);
    }

    // Name typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const nameText = typingText.textContent.trim();

        if (prefersReducedMotion) {
            // Show full text immediately
            typingText.textContent = nameText;
        } else {
            typingText.textContent = '';

            let charIndex = 0;

            function typeText() {
                if (charIndex < nameText.length) {
                    typingText.textContent += nameText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeText, 100);
                }
            }

            // Start typing animation after a short delay
            setTimeout(typeText, 500);
        }
    }

    // Testimonials slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    // Function to show testimonial by index
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });

        // Deactivate all dots and clear aria-selected
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });

        // Show the selected testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        currentTestimonial = index;
    }

    // Function to adjust testimonial container height
    function adjustTestimonialContainerHeight() {
        const container = document.querySelector('.testimonial-container');
        const activeCard = document.querySelector('.testimonial-card.active');

        if (container && activeCard) {
            const cardHeight = activeCard.offsetHeight;
            container.style.height = `${cardHeight}px`;
        }
    }

    // Reset auto advance timer when user interacts with testimonials
    function resetTestimonialTimer() {
        clearInterval(testimonialInterval);
        startTestimonialTimer();
    }

    // Start auto advance timer
    function startTestimonialTimer() {
        if (prefersReducedMotion) return;
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        }, 8000); // Increased to 8 seconds for better user experience
    }

    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
            resetTestimonialTimer();
        });
    }

    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentTestimonial);
            resetTestimonialTimer();
        });
    }

    // Dot click
    if (dots) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                if (!isNaN(index)) {
                    showTestimonial(index);
                    resetTestimonialTimer();
                }
            });
        });
    }

    // Initialize testimonial slider
    if (testimonialCards.length > 0) {
        // Show first testimonial
        showTestimonial(0);
        // Start auto advance timer (skipped if reduced motion preferred)
        startTestimonialTimer();
    }

    // Call the function initially and when window resizes
    if (document.querySelector('.testimonial-container')) {
        window.addEventListener('load', adjustTestimonialContainerHeight);
        window.addEventListener('resize', adjustTestimonialContainerHeight);

        // Also adjust height when testimonial changes
        const originalShowTestimonial = showTestimonial;
        showTestimonial = function(index) {
            originalShowTestimonial(index);
            // Wait for the transition to complete
            setTimeout(adjustTestimonialContainerHeight, 600);
        }
    }

    // Project Modals
    const projectModalOverlay = document.getElementById('projectModalOverlay');
    const projectModals = document.querySelectorAll('.project-modal');
    const projectDetailBtns = document.querySelectorAll('.project-details-btn');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    let lastFocusedBeforeModal = null;
    let modalFocusTrapHandler = null;

    // Open modal when detail button is clicked
    projectDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const projectId = btn.getAttribute('data-id');
            const modal = document.getElementById(`${projectId}Modal`);

            if (modal) {
                lastFocusedBeforeModal = document.activeElement;
                projectModalOverlay.style.display = 'block';
                modal.style.display = 'block';

                // Add animation classes
                setTimeout(() => {
                    projectModalOverlay.classList.add('active');
                    modal.classList.add('active');
                }, 10);

                // Prevent body scrolling when modal is open
                document.body.style.overflow = 'hidden';

                // Focus the close button
                const closeBtn = modal.querySelector('.modal-close-btn');
                if (closeBtn) closeBtn.focus();

                // Set up focus trap within the modal
                const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                modalFocusTrapHandler = (ev) => {
                    if (ev.key !== 'Tab') return;
                    const focusables = modal.querySelectorAll(focusableSelectors);
                    if (focusables.length === 0) return;
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];
                    if (ev.shiftKey && document.activeElement === first) {
                        ev.preventDefault();
                        last.focus();
                    } else if (!ev.shiftKey && document.activeElement === last) {
                        ev.preventDefault();
                        first.focus();
                    }
                };
                modal.addEventListener('keydown', modalFocusTrapHandler);
            }
        });
    });

    // Function to close active modal
    function closeActiveModal() {
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            projectModalOverlay.classList.remove('active');

            if (modalFocusTrapHandler) {
                activeModal.removeEventListener('keydown', modalFocusTrapHandler);
                modalFocusTrapHandler = null;
            }

            // Wait for animation to complete
            setTimeout(() => {
                projectModalOverlay.style.display = 'none';
                activeModal.style.display = 'none';
            }, 300);
        } else {
            projectModalOverlay.style.display = 'none';
            projectModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }

        // Enable body scrolling when modal is closed
        document.body.style.overflow = '';

        // Restore focus to the triggering element
        if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
            lastFocusedBeforeModal.focus();
            lastFocusedBeforeModal = null;
        }
    }

    // Close modal when close button is clicked
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeActiveModal);
    });

    // Close modal when overlay is clicked
    if (projectModalOverlay) {
        projectModalOverlay.addEventListener('click', closeActiveModal);
    }

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.project-modal.active');
            if (openModal) {
                closeActiveModal();
            }
        }
    });

    // Prevent closing modal when clicking on modal content
    projectModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Add animation when elements enter viewport
    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .about-image, .about-text');

    if (prefersReducedMotion) {
        // Show everything immediately
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    } else {
        const animateOnScroll = () => {
            animatedElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;

                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Add initial styles for animations
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Run animation on load and scroll
        window.addEventListener('load', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll);
    }

    // Active nav link highlighting on scroll + aria-current sync
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');
    const sectionsForNav = [];
    navLinkItems.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) sectionsForNav.push({ link, section });
    });

    const setActiveNavLink = (activeLink) => {
        navLinkItems.forEach(link => {
            if (link === activeLink) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    if ('IntersectionObserver' in window && sectionsForNav.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const match = sectionsForNav.find(s => s.section === entry.target);
                    if (match) setActiveNavLink(match.link);
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sectionsForNav.forEach(({ section }) => navObserver.observe(section));
    }

    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    const setThemeAria = (isDark) => {
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }
    };

    // Check if user preference is stored
    const savedTheme = localStorage.getItem('theme');
    const themeColorMeta = document.getElementById('themeColor');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
        setThemeAria(true);
    } else if (savedTheme === 'light') {
        document.body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeColorMeta.setAttribute('content', '#0077b6'); // Light mode primary color
        setThemeAria(false);
    } else {
        // Check for system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
            localStorage.setItem('theme', 'dark');
            setThemeAria(true);
        } else {
            setThemeAria(false);
        }
    }

    // Add transition class for smooth theme switching
    document.body.classList.add('dark-mode-transition');

    // Toggle theme
    if (themeToggle) {
        // Ensure keyboard activatable (themeToggle may be a <div> in current HTML)
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });

        themeToggle.addEventListener('click', () => {
            const themeColorMeta = document.getElementById('themeColor');

            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                themeColorMeta.setAttribute('content', '#0077b6'); // Light mode primary color
                setThemeAria(false);
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
                setThemeAria(true);
            }
        });
    }
});
