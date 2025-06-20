document.addEventListener('DOMContentLoaded', () => {
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
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            scrollToTopBtn.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            scrollToTopBtn.classList.remove('active');
        }
    });
    
    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
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
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // This will handle form submission when Formspree redirects back to your site
        if (window.location.search.includes('?submitted=true')) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
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
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // If form submission fails, restore button
            setTimeout(() => {
                if (document.activeElement === submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
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
    dynamicTexts[0].classList.add('visible');
    
    // Change text every 3 seconds
    setInterval(animateDynamicText, 3000);
    
    // Name typing animation
    const typingText = document.querySelector('.typing-text');
    const nameText = typingText.textContent.trim();
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
        
        // Deactivate all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected testimonial
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
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
        // Start auto advance timer
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
    
    // Open modal when detail button is clicked
    projectDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const projectId = btn.getAttribute('data-id');
            const modal = document.getElementById(`${projectId}Modal`);
            
            if (modal) {
                projectModalOverlay.style.display = 'block';
                modal.style.display = 'block';
                
                // Add animation classes
                setTimeout(() => {
                    projectModalOverlay.classList.add('active');
                    modal.classList.add('active');
                }, 10);
                
                // Prevent body scrolling when modal is open
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Function to close active modal
    function closeActiveModal() {
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            projectModalOverlay.classList.remove('active');
            
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
    }
    
    // Close modal when close button is clicked
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeActiveModal);
    });
    
    // Close modal when overlay is clicked
    projectModalOverlay.addEventListener('click', closeActiveModal);
    
    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeActiveModal();
        }
    });
    
    // Prevent closing modal when clicking on modal content
    projectModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Add animation when elements enter viewport
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card, .skill-item, .about-image, .about-text');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Add initial styles for animations
    document.querySelectorAll('.project-card, .skill-item, .about-image, .about-text').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Dark Mode Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check if user preference is stored
    const savedTheme = localStorage.getItem('theme');
    const themeColorMeta = document.getElementById('themeColor');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
    } else if (savedTheme === 'light') {
        document.body.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeColorMeta.setAttribute('content', '#0077b6'); // Light mode primary color
    } else {
        // Check for system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Add transition class for smooth theme switching
    document.body.classList.add('dark-mode-transition');
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const themeColorMeta = document.getElementById('themeColor');
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeColorMeta.setAttribute('content', '#0077b6'); // Light mode primary color
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeColorMeta.setAttribute('content', '#00b4d8'); // Dark mode primary color
        }
    });
});
