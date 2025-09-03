/*
    STUDIO SIX - MAIN SCRIPT
    Version: 1.1.0
    Author: Stack Pilot
    Description: Core script for navigation, interactions, and theme toggling.
*/

document.addEventListener('DOMContentLoaded', function () {

    // --- 1.0 - PAGE NAVIGATION & INTERACTIONS ---
    const navLinks = document.querySelectorAll('.nav-link');
    const ctaLinks = document.querySelectorAll('.cta-link');
    const pages = document.querySelectorAll('.page');
    const header = document.getElementById('header');

    // Function to show a page
    function showPage(pageId) {
        if (!pageId) return;

        pages.forEach(page => {
            page.classList.remove('active');
        });
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
        }

        // Update active state for navigation links
        navLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        window.scrollTo(0, 0);
    }

    // Attach click listeners for page navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function (e) {
            // Use anchor links for smooth scrolling on the same page
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.getElementById(targetId.substring(1));
                if (targetElement) {
                    showPage(this.dataset.page); // Ensure correct page is shown
                }
            }
        });
    });

    // --- 2.0 - HEADER SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3.0 - MOBILE MENU ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    });

    // --- 4.0 - PROJECT FILTERING ---
    const filterContainer = document.getElementById('filters');
    const projectItems = document.querySelectorAll('.project-item');
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                // Update active button
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                const filter = e.target.dataset.filter;

                projectItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    // --- 5.0 - THEME TOGGLE (DARK/LIGHT MODE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlEl = document.documentElement;

    // Function to set the theme and update icons
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    // Check for saved theme in localStorage or user's system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Event listener for the toggle button
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });


    // --- INITIAL PAGE LOAD ---
    // Show the page corresponding to the hash or default to 'home'
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'home';
    showPage(initialPage);
});
