// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    } else {
        console.warn('AOS library not loaded');
    }

    // Sticky Header
    const header = document.querySelector('header');
    
    // Function to update header state
    function updateHeaderState() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    // Initial check on page load
    updateHeaderState();
    
    // Update on scroll with throttling for better performance
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    
    function onScroll() {
        // Only update if we've scrolled more than 5px (reduces jitter)
        if (Math.abs(lastScrollY - window.scrollY) > 5) {
            lastScrollY = window.scrollY;
            updateHeaderState();
        }
        scrollTimeout = null;
    }
    
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    
    // Also update on window resize (helps with mobile responsiveness)
    window.addEventListener('resize', updateHeaderState);
    
    // Force update header state when sections are loaded
    window.addEventListener('load', updateHeaderState);

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    // Function to update active navigation link
    function updateActiveNavLink() {
        const scrollY = window.scrollY;
        let activeFound = false;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('nav a[href*=' + sectionId + ']');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLink.classList.add('active');
                activeFound = true;
            } else {
                navLink.classList.remove('active');
            }
        });
        
        // If no section is active (at the top of the page), set Home as active
        const homeLink = document.querySelector('nav a[href="#home"]');
        if (homeLink) {
            if (!activeFound && scrollY < 100) {
                homeLink.classList.add('active');
            } else if (scrollY >= 100) {
                homeLink.classList.remove('active');
            }
        }
    }
    
    // Update active link on scroll with throttling for better performance
    let navScrollTimeout;
    window.addEventListener('scroll', function() {
        if (!navScrollTimeout) {
            navScrollTimeout = requestAnimationFrame(function() {
                updateActiveNavLink();
                navScrollTimeout = null;
            });
        }
    }, { passive: true });
    
    // Update active link on page load and after a short delay
    window.addEventListener('load', function() {
        // Initial update
        updateActiveNavLink();
        
        // Update again after a short delay to ensure all elements are properly loaded
        setTimeout(updateActiveNavLink, 100);
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.work-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });

    // Counter animation for stats section
    const counters = document.querySelectorAll('.counter');
    let counted = false;
    
    function startCounting() {
        if (counted) return;
        
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        
        const statsSectionTop = statsSection.offsetTop;
        const statsSectionHeight = statsSection.offsetHeight;
        
        if (window.scrollY > statsSectionTop - window.innerHeight / 1.5 && 
            window.scrollY < statsSectionTop + statsSectionHeight) {
            counters.forEach(counter => {
                const target = +counter.innerText;
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 30); // Update every 30ms
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
            });
            
            counted = true;
        }
    }
    
    window.addEventListener('scroll', startCounting);

    // Form submission animation
   

    // Add hover effect for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotateY(360deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // Add 3D tilt effect to work items
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const boundingRect = this.getBoundingClientRect();
            const x = e.clientX - boundingRect.left;
            const y = e.clientY - boundingRect.top;
            
            const xPercent = x / boundingRect.width;
            const yPercent = y / boundingRect.height;
            
            const rotateX = (0.5 - yPercent) * 10; // -5 to 5 degrees
            const rotateY = (xPercent - 0.5) * 10; // -5 to 5 degrees
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            setTimeout(() => {
                this.style.transition = '';
            }, 300);
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition < window.innerHeight) {
                hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        }
    });

    // Typing animation for hero section
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerText;
        heroTitle.innerText = '';
        
        let i = 0;
        const typingSpeed = 100; // milliseconds per character
        
        function typeWriter() {
            if (i < originalText.length) {
                // Use textContent instead of innerText to preserve spaces
                heroTitle.textContent = originalText.substring(0, i+1);
                i++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }

    // Skill bar animation
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(level => {
        const width = level.style.width;
        level.style.width = '0';
        
        setTimeout(() => {
            level.style.width = width;
        }, 500);
    });
});

// Add this after the DOMContentLoaded event listener starts

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a nav link on mobile
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !nav.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Initialize EmailJS
    (function() {
        // Replace with your actual EmailJS public key
        emailjs.init("DcEd9Pb6OY_G43UaW");
    })();


   